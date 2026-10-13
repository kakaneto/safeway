// Testes do decodificador de "polyline", com o exemplo oficial do formato.
import { describe, expect, it } from 'vitest';
import { decodificarPolyline } from './decodificarPolyline.ts';

describe('decodificarPolyline', () => {
  it('decodifica o exemplo clássico do formato (precisão 5)', () => {
    expect(decodificarPolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@', 5)).toEqual([
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ]);
  });

  it('devolve lista vazia para texto vazio', () => {
    expect(decodificarPolyline('')).toEqual([]);
  });
});
