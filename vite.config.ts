// Configuração do Vite: o programa que roda o app no computador e gera a versão final (pasta dist/).
// Também configura o PWA (instalar no celular e abrir a tela de ajuda sem internet) e o Vitest.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // No GitHub Pages o app mora em /nome-do-repositorio/. O workflow de publicação avisa o nome
  // pela variável NOME_DO_REPOSITORIO (só o nome, sem barras: o Git Bash do Windows estraga
  // valores que começam com "/"). No computador, sem a variável, o caminho é "/".
  base: process.env.NOME_DO_REPOSITORIO ? `/${process.env.NOME_DO_REPOSITORIO}/` : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icones/*.png'],
      manifest: {
        name: 'SAFEWAY',
        short_name: 'SAFEWAY',
        description: 'Rotas a pé sugeridas, com mais iluminação e mais pontos de apoio.',
        lang: 'pt-BR',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#0b1220',
        theme_color: '#0b1220',
        icons: [
          { src: 'icones/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icones/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Guarda o app e os arquivos de dados no aparelho. Os pedaços do mapa NÃO são guardados:
        // as regras do OpenStreetMap e do OpenFreeMap não permitem baixar o mapa para usar offline.
        globPatterns: ['**/*.{js,css,html,png,json}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  // O ajudante do MapLibre é um "module worker": o Vite precisa gerá-lo no formato de módulo.
  worker: { format: 'es' },
  test: {
    // As regras (src/regras) são funções puras: não precisam de navegador para testar.
    environment: 'node',
  },
});
