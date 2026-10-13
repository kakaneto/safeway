// Mostra o mapa escuro (MapLibre + OpenFreeMap) com a rota, as alternativas, os pontos de apoio e os marcadores.
// Se o OpenFreeMap falhar, troca para os tiles do OpenStreetMap. O crédito fica sempre visível (nunca recolhido).
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, StyleSpecification } from 'maplibre-gl';
import type { Feature, FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
// O MapLibre desenha o mapa com um "worker" (ajudante em paralelo). O Vite precisa gerar esse arquivo
// e o MapLibre precisa saber onde ele está; sem isto, o mapa fica em branco.
import urlDoAjudante from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { config, FOZ } from '../servicos/config.ts';
import type { Ponto, Rota } from '../servicos/valhalla.ts';
import type { PontoDeApoio } from '../servicos/dados.ts';

maplibregl.setWorkerUrl(urlDoAjudante);

// Cores com significado fixo (AGENTS.md): ciano = rota sugerida, âmbar = pontos de apoio.
const COR = {
  rota: '#22d3ee',
  alternativa: '#4b6b85',
  apoio: '#fbbf24',
  borda: '#0b1220',
  origem: '#f8fafc',
};

const ESTILO_RESERVA: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

type Props = {
  origem?: Ponto;
  destino?: Ponto;
  rotas: Rota[];
  rotaEscolhida: number;
  pontosDeApoio: PontoDeApoio[];
  mostrarApoio: boolean;
  visivel: boolean;
  rotulo: string;
  credito: string;
  corrigirMapa: string;
  aoTocarNoMapa: (ponto: Ponto) => void;
  aoTocarNoApoio: (ponto: PontoDeApoio) => void;
  aoFalhar: () => void;
};

const colecao = (features: Feature[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features,
});

function desenhar(mapa: maplibregl.Map, p: Props) {
  const fonte = (id: string) => mapa.getSource(id) as GeoJSONSource | undefined;
  fonte('rotas')?.setData(
    colecao(
      p.rotas
        .map((rota, i) => ({
          type: 'Feature' as const,
          properties: { escolhida: i === p.rotaEscolhida },
          geometry: {
            type: 'LineString' as const,
            coordinates: rota.pontos.map(([lat, lon]) => [lon, lat]),
          },
        }))
        .sort((a, b) => Number(a.properties.escolhida) - Number(b.properties.escolhida)),
    ),
  );
  fonte('apoio')?.setData(
    colecao(
      p.pontosDeApoio.map((ponto) => ({
        type: 'Feature',
        properties: { id: ponto.id },
        geometry: { type: 'Point', coordinates: [ponto.lon, ponto.lat] },
      })),
    ),
  );
  const marcadores = [
    p.origem && { papel: 'origem', ponto: p.origem },
    p.destino && { papel: 'destino', ponto: p.destino },
  ].filter((m): m is { papel: string; ponto: Ponto } => Boolean(m));
  fonte('marcadores')?.setData(
    colecao(
      marcadores.map((m) => ({
        type: 'Feature',
        properties: { papel: m.papel },
        geometry: { type: 'Point', coordinates: [m.ponto.lon, m.ponto.lat] },
      })),
    ),
  );
  if (mapa.getLayer('apoio'))
    mapa.setLayoutProperty('apoio', 'visibility', p.mostrarApoio ? 'visible' : 'none');
}

function adicionarCamadas(mapa: maplibregl.Map) {
  for (const id of ['rotas', 'apoio', 'marcadores']) {
    if (!mapa.getSource(id)) mapa.addSource(id, { type: 'geojson', data: colecao([]) });
  }
  mapa.addLayer({
    id: 'rotas-alternativas',
    type: 'line',
    source: 'rotas',
    filter: ['==', ['get', 'escolhida'], false],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': COR.alternativa, 'line-width': 5 },
  });
  mapa.addLayer({
    id: 'rota-escolhida',
    type: 'line',
    source: 'rotas',
    filter: ['==', ['get', 'escolhida'], true],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': COR.rota, 'line-width': 7 },
  });
  mapa.addLayer({
    id: 'apoio',
    type: 'circle',
    source: 'apoio',
    paint: {
      'circle-radius': 7,
      'circle-color': COR.apoio,
      'circle-stroke-color': COR.borda,
      'circle-stroke-width': 2,
    },
  });
  mapa.addLayer({
    id: 'marcadores',
    type: 'circle',
    source: 'marcadores',
    paint: {
      'circle-radius': 10,
      'circle-color': ['match', ['get', 'papel'], 'origem', COR.origem, COR.rota],
      'circle-stroke-color': COR.borda,
      'circle-stroke-width': 3,
    },
  });
}

export default function MapaInterativo(props: Props) {
  const elemento = useRef<HTMLDivElement>(null);
  const mapa = useRef<maplibregl.Map | null>(null);
  const atuais = useRef(props);

  useEffect(() => {
    atuais.current = props;
    if (mapa.current?.isStyleLoaded()) desenhar(mapa.current, props);
  });

  useEffect(() => {
    if (!elemento.current) return;
    const novo = new maplibregl.Map({
      container: elemento.current,
      style: config.estiloMapa,
      center: [FOZ.centro.lon, FOZ.centro.lat],
      zoom: 13,
      attributionControl: false,
    });
    novo.addControl(
      new maplibregl.AttributionControl({
        compact: false,
        customAttribution: `${atuais.current.credito} · <a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noreferrer">${atuais.current.corrigirMapa}</a>`,
      }),
      'top-right',
    );

    let carregou = false;
    let usandoReserva = false;
    novo.on('load', () => (carregou = true));
    novo.on('error', () => {
      if (carregou) return;
      if (!usandoReserva) {
        usandoReserva = true;
        novo.setStyle(ESTILO_RESERVA);
      } else atuais.current.aoFalhar();
    });
    novo.on('style.load', () => {
      adicionarCamadas(novo);
      desenhar(novo, atuais.current);
    });
    novo.on('click', (evento) => {
      const p = atuais.current;
      if (p.mostrarApoio && novo.getLayer('apoio')) {
        const tocado = novo.queryRenderedFeatures(evento.point, { layers: ['apoio'] })[0];
        const ponto = tocado && p.pontosDeApoio.find((x) => x.id === tocado.properties.id);
        if (ponto) return p.aoTocarNoApoio(ponto);
      }
      p.aoTocarNoMapa({ lat: evento.lngLat.lat, lon: evento.lngLat.lng });
    });
    mapa.current = novo;
    return () => {
      novo.remove();
      mapa.current = null;
    };
  }, []);

  // Enquadra a rota escolhida quando ela muda; centraliza na origem quando ela é marcada.
  const rotaAtual = props.rotas[props.rotaEscolhida];
  useEffect(() => {
    if (!mapa.current || !rotaAtual) return;
    const limites = new maplibregl.LngLatBounds();
    rotaAtual.pontos.forEach(([lat, lon]) => limites.extend([lon, lat]));
    mapa.current.fitBounds(limites, {
      padding: { top: 140, bottom: 320, left: 40, right: 40 },
      maxZoom: 17,
    });
  }, [rotaAtual]);

  const { origem, visivel } = props;
  useEffect(() => {
    if (mapa.current && origem) mapa.current.easeTo({ center: [origem.lon, origem.lat], zoom: 15 });
  }, [origem]);

  // O mapa precisa recalcular o tamanho quando a tela dele volta a aparecer.
  useEffect(() => {
    if (visivel) mapa.current?.resize();
  }, [visivel]);

  // A caixa de fora ocupa a tela e o mapa ocupa 100% dela. O CSS do MapLibre põe "position: relative"
  // no elemento do mapa, então ele não pode ser o mesmo elemento que usa "absolute inset-0".
  return (
    <div className="absolute inset-0">
      <div ref={elemento} role="region" aria-label={props.rotulo} className="h-full w-full" />
    </div>
  );
}
