// Decide em que idioma mostrar o app, a partir da lista de idiomas preferidos do navegador.
// Vale o primeiro da lista que for espanhol ou português; se nenhum for, usa português.
export type Idioma = 'pt-BR' | 'es';

export function escolherIdioma(preferidos: readonly string[]): Idioma {
  for (const preferido of preferidos) {
    const codigo = preferido.toLowerCase();
    if (codigo === 'es' || codigo.startsWith('es-')) return 'es';
    if (codigo === 'pt' || codigo.startsWith('pt-')) return 'pt-BR';
  }
  return 'pt-BR';
}
