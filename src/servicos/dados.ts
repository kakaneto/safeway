// Carrega os arquivos de dados que vêm junto com o app (gerados por scripts/gerar-dados.mjs).
// Nenhuma consulta à Overpass acontece no celular: assim a localização da pessoa não vai para ela.
import type { Resultado } from '../regras/resultado.ts';
import type { MapaDeLuz } from '../regras/resumirIluminacao.ts';
import curados from '../dados/pontos-de-apoio.json';

export type TipoDeApoio =
  'policia' | 'bombeiros' | 'hospital' | 'saude' | 'farmacia' | 'assistencia' | 'biblioteca';
export type PontoDeApoio = {
  id: string;
  tipo: TipoDeApoio;
  nome: string;
  lat: number;
  lon: number;
  horario?: string;
  telefone?: string;
  fonte: string;
};
export type DadosDeApoio = { pontos: PontoDeApoio[]; dadosDe?: string };
export type DadosDeLuz = { vias: MapaDeLuz; dadosDe?: string };

async function lerArquivo<T>(nome: string): Promise<Resultado<T>> {
  try {
    const resposta = await fetch(`${import.meta.env.BASE_URL}dados/${nome}`);
    if (!resposta.ok) return { tipo: 'falhou', motivo: `HTTP ${resposta.status}` };
    return { tipo: 'com-dado', dados: (await resposta.json()) as T };
  } catch (erro) {
    return { tipo: 'falhou', motivo: String(erro) };
  }
}

export async function carregarPontosDeApoio(): Promise<Resultado<DadosDeApoio>> {
  const osm = await lerArquivo<{ pontos: Omit<PontoDeApoio, 'fonte'>[]; dadosDe?: string }>(
    'pontos-de-apoio-osm.json',
  );
  const daTurma = (curados.pontos as PontoDeApoio[]).map((p) => ({
    ...p,
    fonte: p.fonte ?? 'turma',
  }));
  if (osm.tipo !== 'com-dado')
    return daTurma.length ? { tipo: 'com-dado', dados: { pontos: daTurma } } : osm;
  const pontos = [...osm.dados.pontos.map((p) => ({ ...p, fonte: 'OpenStreetMap' })), ...daTurma];
  return { tipo: 'com-dado', dados: { pontos, dadosDe: osm.dados.dadosDe } };
}

export function carregarLuz(): Promise<Resultado<DadosDeLuz>> {
  return lerArquivo<DadosDeLuz>('iluminacao-foz.json');
}
