// Desenha os ícones do app (192 e 512 px) sem precisar de programa de imagem: um caminho ciano
// sobre o azul-noite, com um ponto âmbar de luz. Rodar: `node scripts/gerar-icones.mjs`.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const FUNDO = [11, 18, 32];
const CIANO = [34, 211, 238];
const AMBAR = [251, 191, 36];

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function bloco(tipo, dados) {
  const tamanho = Buffer.alloc(4);
  tamanho.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tamanho, corpo, crc]);
}

function distanciaAoSegmento(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function desenhar(tamanho) {
  // Caminho em "S" dentro da área segura (80% do centro), para funcionar como ícone "maskable".
  const caminho = [
    [0.3, 0.78],
    [0.3, 0.56],
    [0.62, 0.48],
    [0.62, 0.3],
  ].map(([x, y]) => [x * tamanho, y * tamanho]);
  const luz = [0.62 * tamanho, 0.27 * tamanho];
  const espessura = 0.075 * tamanho;
  const raioLuz = 0.085 * tamanho;
  const linhas = [];
  for (let y = 0; y < tamanho; y++) {
    const linha = Buffer.alloc(1 + tamanho * 3);
    for (let x = 0; x < tamanho; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      let cor = FUNDO;
      const dCaminho = Math.min(
        ...caminho.slice(1).map((b, i) => distanciaAoSegmento(px, py, caminho[i], b)),
      );
      const cobreCaminho = Math.max(0, Math.min(1, espessura / 2 - dCaminho + 0.5));
      const cobreLuz = Math.max(
        0,
        Math.min(1, raioLuz - Math.hypot(px - luz[0], py - luz[1]) + 0.5),
      );
      const misturar = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
      cor = misturar(cor, CIANO, cobreCaminho);
      cor = misturar(cor, AMBAR, cobreLuz);
      linha.set(cor, 1 + x * 3);
    }
    linhas.push(linha);
  }
  const cabecalho = Buffer.alloc(13);
  cabecalho.writeUInt32BE(tamanho, 0);
  cabecalho.writeUInt32BE(tamanho, 4);
  cabecalho.set([8, 2, 0, 0, 0], 8); // 8 bits, RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloco('IHDR', cabecalho),
    bloco('IDAT', deflateSync(Buffer.concat(linhas))),
    bloco('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icones', { recursive: true });
for (const tamanho of [192, 512]) {
  writeFileSync(`public/icones/icone-${tamanho}.png`, desenhar(tamanho));
  console.log(`public/icones/icone-${tamanho}.png`);
}
