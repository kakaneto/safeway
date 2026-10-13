// Transforma o desenho da rota que o Valhalla devolve (texto "polyline", precisão 6)
// numa lista de pontos [latitude, longitude].
export function decodificarPolyline(texto: string, precisao = 6): [number, number][] {
  const fator = 10 ** precisao;
  const pontos: [number, number][] = [];
  let indice = 0;
  let lat = 0;
  let lon = 0;
  while (indice < texto.length) {
    for (const eixo of [0, 1]) {
      let byte: number;
      let deslocamento = 0;
      let resultado = 0;
      do {
        byte = texto.charCodeAt(indice++) - 63;
        resultado |= (byte & 0x1f) << deslocamento;
        deslocamento += 5;
      } while (byte >= 0x20);
      const delta = resultado & 1 ? ~(resultado >> 1) : resultado >> 1;
      if (eixo === 0) lat += delta;
      else lon += delta;
    }
    pontos.push([lat / fator, lon / fator]);
  }
  return pontos;
}
