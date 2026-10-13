// Configuração do Vite: o programa que roda o app no computador e gera a versão final (pasta dist/).
// Também configura o Vitest, que roda os testes.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // No GitHub Pages o app mora em /nome-do-repositorio/. O workflow de publicação avisa o nome
  // pela variável NOME_DO_REPOSITORIO (só o nome, sem barras: o Git Bash do Windows estraga
  // valores que começam com "/"). No computador, sem a variável, o caminho é "/".
  base: process.env.NOME_DO_REPOSITORIO ? `/${process.env.NOME_DO_REPOSITORIO}/` : '/',
  plugins: [react(), tailwindcss()],
  test: {
    // As regras (src/regras) são funções puras: não precisam de navegador para testar.
    environment: 'node',
  },
});
