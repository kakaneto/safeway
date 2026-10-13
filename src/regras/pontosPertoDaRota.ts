// Encontra os pontos de apoio a até N metros do desenho da rota.
// Usa uma conta aproximada (plano local), boa para as distâncias curtas de uma cidade.
type Coordenada = { lat: number; lon: number };

const METROS_POR_GRAU_LAT = 110540;
const METROS_POR_GRAU_LON = 111320;

function distanciaAoSegmento(p: Coordenada, a: [number, number], b: [number, number]): number {
  const cos = Math.cos((p.lat * Math.PI) / 180);
  const ax = (a[1] - p.lon) * METROS_POR_GRAU_LON * cos;
  const ay = (a[0] - p.lat) * METROS_POR_GRAU_LAT;
  const bx = (b[1] - p.lon) * METROS_POR_GRAU_LON * cos;
  const by = (b[0] - p.lat) * METROS_POR_GRAU_LAT;
  const dx = bx - ax;
  const dy = by - ay;
  const comprimento2 = dx * dx + dy * dy;
  const t = comprimento2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / comprimento2));
  return Math.hypot(ax + t * dx, ay + t * dy);
}

export function pontosPertoDaRota<T extends Coordenada>(
  pontos: T[],
  rota: [number, number][],
  raioMetros: number,
): T[] {
  if (rota.length === 0) return [];
  const segmentos =
    rota.length === 1
      ? [[rota[0], rota[0]] as const]
      : rota.slice(1).map((b, i) => [rota[i], b] as const);
  return pontos.filter((p) =>
    segmentos.some(([a, b]) => distanciaAoSegmento(p, a, b) <= raioMetros),
  );
}
