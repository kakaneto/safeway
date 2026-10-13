// Endereços dos serviços e dados fixos do piloto. Os endereços podem ser trocados no .env.local
// (veja .env.example) sem mexer no código, como pedem os termos do Nominatim e da FOSSGIS.
export const config = {
  valhalla: import.meta.env.VITE_URL_VALHALLA || 'https://valhalla1.openstreetmap.de',
  photon: import.meta.env.VITE_URL_PHOTON || 'https://photon.komoot.io',
  estiloMapa:
    import.meta.env.VITE_URL_ESTILO_MAPA || 'https://tiles.openfreemap.org/styles/liberty',
  // Identifica o app para o servidor de rotas, como pede o projeto Valhalla.
  idDoCliente: 'safeway-prototipo',
};

// Foz do Iguaçu: centro e retângulo da cidade (relação 297473 do OpenStreetMap, com folga).
export const FOZ = {
  centro: { lat: -25.5304, lon: -54.5831 },
  retangulo: [-54.63, -25.71, -54.28, -25.2] as const,
};

// Distância usada para contar pontos de apoio "perto" da rota.
export const RAIO_APOIO_METROS = 100;
