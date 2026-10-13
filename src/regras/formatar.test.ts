// Testes das funções que formatam distância, tempo e textos com valores.
import { describe, expect, it } from 'vitest';
import { formatarDistancia, formatarTempo, preencher } from './formatar.ts';

describe('formatarDistancia', () => {
  it('mostra metros abaixo de 1 km, arredondando de 10 em 10', () => {
    expect(formatarDistancia(847, 'pt-BR')).toBe('850 m');
    expect(formatarDistancia(3, 'pt-BR')).toBe('10 m');
  });

  it('mostra km com vírgula em português e em espanhol', () => {
    expect(formatarDistancia(2066, 'pt-BR')).toBe('2,1 km');
    expect(formatarDistancia(2066, 'es')).toBe('2,1 km');
  });
});

describe('formatarTempo', () => {
  it('mostra minutos e horas', () => {
    expect(formatarTempo(20)).toBe('1 min');
    expect(formatarTempo(1620)).toBe('27 min');
    expect(formatarTempo(3600)).toBe('1 h');
    expect(formatarTempo(4500)).toBe('1 h 15 min');
  });
});

describe('preencher', () => {
  it('troca as chaves pelos valores e deixa as desconhecidas como estão', () => {
    expect(preencher('{n} pontos a até {raio} m', { n: 3, raio: 100 })).toBe(
      '3 pontos a até 100 m',
    );
    expect(preencher('{x} fica', {})).toBe('{x} fica');
  });
});
