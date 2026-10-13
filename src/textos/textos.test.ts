// Confere que português e espanhol têm exatamente os mesmos textos: nenhum esquecido, nenhum vazio,
// e que nenhum texto promete segurança.
import { describe, expect, it } from 'vitest';
import ptBR from './pt-BR.json';
import es from './es.json';

// Transforma {"app": {"nome": "x"}} em ["app.nome"], para comparar os dois arquivos.
function listarChaves(objeto: object, prefixo = ''): string[] {
  return Object.entries(objeto).flatMap(([chave, valor]) =>
    typeof valor === 'object' && valor !== null
      ? listarChaves(valor, `${prefixo}${chave}.`)
      : [`${prefixo}${chave}`],
  );
}

function listarValores(objeto: object): unknown[] {
  return Object.values(objeto).flatMap((valor) =>
    typeof valor === 'object' && valor !== null ? listarValores(valor) : [valor],
  );
}

const PROMESSA_DE_SEGURANCA = new RegExp(String.raw`\b(segur[oa]s?|safe route)\b`, 'i');

describe('textos', () => {
  it('pt-BR.json e es.json têm as mesmas chaves', () => {
    expect(listarChaves(es).sort()).toEqual(listarChaves(ptBR).sort());
  });

  it('nenhum texto está vazio', () => {
    for (const valor of [...listarValores(ptBR), ...listarValores(es)]) {
      expect(typeof valor).toBe('string');
      expect(String(valor).trim()).not.toBe('');
    }
  });

  it('nenhum texto promete segurança (regra 4: "rota sugerida", nunca "rota segura")', () => {
    for (const valor of [...listarValores(ptBR), ...listarValores(es)]) {
      expect(String(valor)).not.toMatch(PROMESSA_DE_SEGURANCA);
    }
  });
});
