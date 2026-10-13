// Monta a explicação "Por que esta rota" só com os dados que foram realmente usados.
// Devolve itens com números; a tela transforma cada item no texto do idioma escolhido.
import type { Resultado } from './resultado.ts';
import type { ResumoIluminacao } from './resumirIluminacao.ts';

export type ItemExplicacao =
  | { tipo: 'distancia'; metros: number; segundos: number }
  | { tipo: 'preferencia-luz' }
  | { tipo: 'iluminacao-falhou' }
  | { tipo: 'iluminacao-insuficiente'; semDado: number }
  | { tipo: 'iluminacao'; comLuz: number; semLuz: number; semDado: number }
  | { tipo: 'apoio-falhou' }
  | { tipo: 'apoio-nenhum'; raio: number }
  | { tipo: 'apoio'; quantidade: number; raio: number }
  | { tipo: 'aviso' };

// Acima desta parte do caminho sem informação, a conclusão honesta é "dados insuficientes".
export const LIMITE_SEM_DADO = 0.5;

const porcento = (parte: number, total: number) =>
  total > 0 ? Math.round((parte / total) * 100) : 0;

export function explicarRota(entrada: {
  metros: number;
  segundos: number;
  iluminacao: Resultado<ResumoIluminacao>;
  pontosPerto: Resultado<number>;
  raio: number;
}): ItemExplicacao[] {
  const itens: ItemExplicacao[] = [
    { tipo: 'distancia', metros: entrada.metros, segundos: entrada.segundos },
    { tipo: 'preferencia-luz' },
  ];

  const luz = entrada.iluminacao;
  if (luz.tipo === 'falhou') itens.push({ tipo: 'iluminacao-falhou' });
  else if (luz.tipo === 'sem-dado' || luz.dados.total === 0)
    itens.push({ tipo: 'iluminacao-insuficiente', semDado: 100 });
  else {
    const { comLuz, semLuz, semDado, total } = luz.dados;
    if (semDado / total > LIMITE_SEM_DADO) {
      itens.push({ tipo: 'iluminacao-insuficiente', semDado: porcento(semDado, total) });
    } else {
      itens.push({
        tipo: 'iluminacao',
        comLuz: porcento(comLuz, total),
        semLuz: porcento(semLuz, total),
        semDado: porcento(semDado, total),
      });
    }
  }

  const apoio = entrada.pontosPerto;
  if (apoio.tipo === 'falhou') itens.push({ tipo: 'apoio-falhou' });
  else if (apoio.tipo === 'sem-dado' || apoio.dados === 0)
    itens.push({ tipo: 'apoio-nenhum', raio: entrada.raio });
  else itens.push({ tipo: 'apoio', quantidade: apoio.dados, raio: entrada.raio });

  itens.push({ tipo: 'aviso' });
  return itens;
}
