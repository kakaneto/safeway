// Guarda preferências e favoritos SÓ no aparelho (localStorage do navegador).
// Todas as chaves começam com "safeway:", para o botão "apagar tudo" achar e remover cada uma.
const PREFIXO = 'safeway:';

export function ler<T>(chave: string, padrao: T): T {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);
    return texto === null ? padrao : (JSON.parse(texto) as T);
  } catch {
    return padrao;
  }
}

export function gravar(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch {
    // Sem espaço ou modo privado: o app continua funcionando, só não lembra a escolha.
  }
}

export function apagarTudo(): void {
  try {
    Object.keys(localStorage)
      .filter((chave) => chave.startsWith(PREFIXO))
      .forEach((chave) => localStorage.removeItem(chave));
  } catch {
    // Nada a apagar.
  }
}
