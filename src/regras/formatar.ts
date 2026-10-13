// Transforma metros e segundos em textos curtos para a tela ("850 m", "2,1 km", "27 min").
import type { Idioma } from './escolherIdioma.ts';

export function formatarDistancia(metros: number, idioma: Idioma): string {
  if (metros < 1000) return `${Math.max(10, Math.round(metros / 10) * 10)} m`;
  const km = new Intl.NumberFormat(idioma, { maximumFractionDigits: 1 }).format(metros / 1000);
  return `${km} km`;
}

export function formatarTempo(segundos: number): string {
  const minutos = Math.max(1, Math.round(segundos / 60));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

// Troca {chave} pelo valor correspondente: preencher("{n} pontos", { n: 3 }) => "3 pontos".
export function preencher(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (inteiro, chave: string) =>
    chave in valores ? String(valores[chave]) : inteiro,
  );
}
