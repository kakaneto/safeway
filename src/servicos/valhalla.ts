// Rotas a pé (Valhalla, servidor da FOSSGIS). Envia as coordenadas de origem e destino só quando
// a pessoa aperta "Traçar rota". Respeita o limite de 1 pedido por segundo do servidor.
import type { Resultado } from '../regras/resultado.ts';
import type { Trecho } from '../regras/resumirIluminacao.ts';
import { decodificarPolyline } from '../regras/decodificarPolyline.ts';
import { config } from './config.ts';

export type Ponto = { lat: number; lon: number };
export type Rota = { metros: number; segundos: number; forma: string; pontos: [number, number][] };

// Preferência moderada por ruas com registro de luz: trechos sem registro "custam" 2 vezes mais.
const USO_DE_LUZ = 0.5;

let ultimoPedido = 0;
async function esperarVez() {
  const espera = ultimoPedido + 1100 - Date.now();
  if (espera > 0) await new Promise((r) => setTimeout(r, espera));
  ultimoPedido = Date.now();
}

async function pedir(
  acao: string,
  corpo: object,
): Promise<{ ok: true; json: unknown } | { ok: false; motivo: string }> {
  await esperarVez();
  try {
    const resposta = await fetch(`${config.valhalla}/${acao}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Id': config.idDoCliente },
      body: JSON.stringify(corpo),
    });
    const json: unknown = await resposta.json().catch(() => null);
    if (!resposta.ok) {
      const erro = (json as { error?: string } | null)?.error;
      return { ok: false, motivo: erro ?? `HTTP ${resposta.status}` };
    }
    return { ok: true, json };
  } catch (erro) {
    return { ok: false, motivo: String(erro) };
  }
}

type Viagem = { summary: { length: number; time: number }; legs: { shape: string }[] };

export async function pedirRotas(de: Ponto, para: Ponto): Promise<Resultado<Rota[]>> {
  const resposta = await pedir('route', {
    locations: [de, para],
    costing: 'pedestrian',
    costing_options: { pedestrian: { use_lit: USO_DE_LUZ } },
    alternates: 2,
    units: 'kilometers',
  });
  if (!resposta.ok) return { tipo: 'falhou', motivo: resposta.motivo };
  const json = resposta.json as { trip?: Viagem; alternates?: { trip: Viagem }[] };
  if (!json.trip) return { tipo: 'sem-dado' };
  const viagens = [json.trip, ...(json.alternates ?? []).map((a) => a.trip)];
  return {
    tipo: 'com-dado',
    dados: viagens.map((v) => ({
      metros: v.summary.length * 1000,
      segundos: v.summary.time,
      forma: v.legs[0].shape,
      pontos: decodificarPolyline(v.legs[0].shape),
    })),
  };
}

// Pergunta ao Valhalla quais vias do OpenStreetMap (way_id) formam a rota, e o comprimento de cada trecho.
export async function pedirTrechos(forma: string): Promise<Resultado<Trecho[]>> {
  const resposta = await pedir('trace_attributes', {
    encoded_polyline: forma,
    shape_match: 'edge_walk',
    costing: 'pedestrian',
    filters: { attributes: ['edge.way_id', 'edge.length'], action: 'include' },
  });
  if (!resposta.ok) return { tipo: 'falhou', motivo: resposta.motivo };
  const arestas = (resposta.json as { edges?: { way_id: number; length: number }[] }).edges ?? [];
  if (!arestas.length) return { tipo: 'sem-dado' };
  return {
    tipo: 'com-dado',
    dados: arestas.map((a) => ({ viaId: a.way_id, metros: a.length * 1000 })),
  };
}
