// Testes da regra que escolhe o idioma do app.
import { describe, expect, it } from 'vitest';
import { escolherIdioma } from './escolherIdioma.ts';

describe('escolherIdioma', () => {
  it('usa espanhol quando o navegador prefere espanhol (Paraguai, Argentina, Venezuela)', () => {
    expect(escolherIdioma(['es-PY', 'es'])).toBe('es');
    expect(escolherIdioma(['es-AR'])).toBe('es');
    expect(escolherIdioma(['es-VE'])).toBe('es');
  });

  it('usa português quando o navegador prefere português', () => {
    expect(escolherIdioma(['pt-BR', 'es'])).toBe('pt-BR');
    expect(escolherIdioma(['pt'])).toBe('pt-BR');
  });

  it('pula idiomas que o app não tem e usa o próximo da lista', () => {
    expect(escolherIdioma(['en-US', 'es'])).toBe('es');
    expect(escolherIdioma(['gn', 'pt-BR'])).toBe('pt-BR');
  });

  it('usa português quando não há nenhuma preferência conhecida', () => {
    expect(escolherIdioma(['en-US'])).toBe('pt-BR');
    expect(escolherIdioma([])).toBe('pt-BR');
  });

  it('não se confunde com códigos parecidos', () => {
    expect(escolherIdioma(['est'])).toBe('pt-BR');
  });
});
