// Busca de lugares enquanto a pessoa digita (Photon). Envia só o texto digitado e o retângulo
// de Foz, nunca a localização da pessoa. O Photon não aceita "pt" nem "es": usamos lang=default.
import type { Resultado } from '../regras/resultado.ts';
import { config, FOZ } from './config.ts';

export type Lugar = { nome: string; detalhe: string; lat: number; lon: number };

type RespostaPhoton = {
  features: {
    geometry: { coordinates: [number, number] };
    properties: {
      name?: string;
      street?: string;
      housenumber?: string;
      district?: string;
      city?: string;
    };
  }[];
};

export async function buscarLugares(
  texto: string,
  sinal: AbortSignal,
): Promise<Resultado<Lugar[]>> {
  const url = `${config.photon}/api/?q=${encodeURIComponent(texto)}&limit=6&lang=default&bbox=${FOZ.retangulo.join(',')}`;
  try {
    const resposta = await fetch(url, { signal: sinal });
    if (!resposta.ok) return { tipo: 'falhou', motivo: `HTTP ${resposta.status}` };
    const dados = (await resposta.json()) as RespostaPhoton;
    const lugares = dados.features.map(({ geometry, properties: p }) => ({
      nome: p.name ?? [p.street, p.housenumber].filter(Boolean).join(', '),
      detalhe: [p.name ? p.street : undefined, p.district ?? p.city].filter(Boolean).join(' · '),
      lon: geometry.coordinates[0],
      lat: geometry.coordinates[1],
    }));
    return lugares.length ? { tipo: 'com-dado', dados: lugares } : { tipo: 'sem-dado' };
  } catch (erro) {
    if (sinal.aborted) throw erro;
    return { tipo: 'falhou', motivo: String(erro) };
  }
}
