// Testes da explicação "Por que esta rota" e das regras de iluminação e pontos de apoio.
import { describe, expect, it } from 'vitest';
import { explicarRota } from './explicarRota.ts';
import { resumirIluminacao } from './resumirIluminacao.ts';
import { pontosPertoDaRota } from './pontosPertoDaRota.ts';

const base = { metros: 2066, segundos: 1620, raio: 100 };

describe('resumirIluminacao', () => {
  const trechos = [
    { viaId: 1, metros: 100 },
    { viaId: 2, metros: 50 },
    { viaId: 3, metros: 50 },
    { viaId: 4, metros: 20 },
  ];

  it('separa com luz, sem luz e sem dado', () => {
    expect(resumirIluminacao(trechos, { '1': 'yes', '2': 'no', '4': 'limited' })).toEqual({
      comLuz: 100,
      semLuz: 50,
      semDado: 70,
      total: 220,
    });
  });

  it('rua sem etiqueta conta como sem dado, nunca como apagada', () => {
    expect(resumirIluminacao(trechos, {}).semLuz).toBe(0);
    expect(resumirIluminacao(trechos, {}).semDado).toBe(220);
  });
});

describe('explicarRota', () => {
  it('diz "dados insuficientes" quando o mapa não tem informação de luz (caso de Foz hoje)', () => {
    const itens = explicarRota({
      ...base,
      iluminacao: { tipo: 'com-dado', dados: { comLuz: 0, semLuz: 0, semDado: 2066, total: 2066 } },
      pontosPerto: { tipo: 'com-dado', dados: 3 },
    });
    expect(itens).toContainEqual({ tipo: 'iluminacao-insuficiente', semDado: 100 });
    expect(itens).toContainEqual({ tipo: 'apoio', quantidade: 3, raio: 100 });
  });

  it('diz que a consulta falhou, sem fingir que não há dado', () => {
    const itens = explicarRota({
      ...base,
      iluminacao: { tipo: 'falhou', motivo: 'HTTP 504' },
      pontosPerto: { tipo: 'falhou', motivo: 'sem internet' },
    });
    expect(itens).toContainEqual({ tipo: 'iluminacao-falhou' });
    expect(itens).toContainEqual({ tipo: 'apoio-falhou' });
    expect(itens.some((i) => i.tipo === 'iluminacao-insuficiente')).toBe(false);
  });

  it('mostra as porcentagens quando há informação suficiente', () => {
    const itens = explicarRota({
      ...base,
      iluminacao: {
        tipo: 'com-dado',
        dados: { comLuz: 700, semLuz: 100, semDado: 200, total: 1000 },
      },
      pontosPerto: { tipo: 'com-dado', dados: 0 },
    });
    expect(itens).toContainEqual({ tipo: 'iluminacao', comLuz: 70, semLuz: 10, semDado: 20 });
    expect(itens).toContainEqual({ tipo: 'apoio-nenhum', raio: 100 });
  });

  it('sempre começa com a distância e termina com o aviso de que a rota é só sugerida', () => {
    const itens = explicarRota({
      ...base,
      iluminacao: { tipo: 'sem-dado' },
      pontosPerto: { tipo: 'sem-dado' },
    });
    expect(itens[0]).toEqual({ tipo: 'distancia', metros: 2066, segundos: 1620 });
    expect(itens.at(-1)).toEqual({ tipo: 'aviso' });
  });
});

describe('pontosPertoDaRota', () => {
  const rota: [number, number][] = [
    [-25.53, -54.58],
    [-25.54, -54.58],
  ];

  it('acha pontos a até 100 m e ignora os mais longe', () => {
    const perto = { lat: -25.535, lon: -54.5805, nome: 'perto' }; // ~50 m a leste da linha
    const longe = { lat: -25.535, lon: -54.575, nome: 'longe' }; // ~500 m a leste
    expect(pontosPertoDaRota([perto, longe], rota, 100).map((p) => p.nome)).toEqual(['perto']);
  });

  it('não acha nada numa rota vazia', () => {
    expect(pontosPertoDaRota([{ lat: -25.53, lon: -54.58 }], [], 100)).toEqual([]);
  });
});
