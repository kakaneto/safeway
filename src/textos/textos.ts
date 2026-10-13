// Entrega os textos da tela no idioma pedido. Os textos moram nos arquivos JSON desta pasta,
// nunca direto no código; assim todo texto existe em português e em espanhol.
import type { Idioma } from '../regras/escolherIdioma.ts';
import ptBR from './pt-BR.json';
import es from './es.json';

export type Textos = typeof ptBR;

// Se o es.json esquecer algum texto que existe no pt-BR.json, o TypeScript acusa erro aqui.
const textosPorIdioma: Record<Idioma, Textos> = { 'pt-BR': ptBR, es };

export function pegarTextos(idioma: Idioma): Textos {
  return textosPorIdioma[idioma];
}
