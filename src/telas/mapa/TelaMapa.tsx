// Tela principal: mapa, "Onde estou", busca do destino, rota a pé com alternativas, "Por que esta rota",
// pontos de apoio e "Cheguei bem". A localização só sai do aparelho quando a pessoa toca em "Traçar rota".
import { useEffect, useMemo, useState } from 'react';
import { LocateFixedIcon, MapPinIcon, RouteIcon, XIcon } from 'lucide-react';
import MapaInterativo from '../../componentes/MapaInterativo.tsx';
import BuscaDestino from '../../componentes/BuscaDestino.tsx';
import ExplicacaoRota from '../../componentes/ExplicacaoRota.tsx';
import ChegueiBem from '../../componentes/ChegueiBem.tsx';
import { pedirRotas, pedirTrechos, type Ponto, type Rota } from '../../servicos/valhalla.ts';
import {
  carregarLuz,
  carregarPontosDeApoio,
  type DadosDeApoio,
  type DadosDeLuz,
  type PontoDeApoio,
} from '../../servicos/dados.ts';
import { gravar, ler } from '../../servicos/armazenamento.ts';
import { RAIO_APOIO_METROS } from '../../servicos/config.ts';
import { explicarRota } from '../../regras/explicarRota.ts';
import {
  resumirIluminacao,
  type ResumoIluminacao,
  type Trecho,
} from '../../regras/resumirIluminacao.ts';
import { pontosPertoDaRota } from '../../regras/pontosPertoDaRota.ts';
import { formatarDistancia, formatarTempo, preencher } from '../../regras/formatar.ts';
import type { Resultado } from '../../regras/resultado.ts';
import type { Idioma } from '../../regras/escolherIdioma.ts';
import type { Textos } from '../../textos/textos.ts';

export type Lugar = Ponto & { rotulo: string };
export type TipoFavorito = 'casa' | 'escola' | 'projeto';

type Props = {
  textos: Textos;
  idioma: Idioma;
  visivel: boolean;
  origem?: Lugar;
  destino?: Lugar;
  mudarOrigem: (lugar?: Lugar) => void;
  mudarDestino: (lugar?: Lugar) => void;
  salvarFavorito: (tipo: TipoFavorito, lugar: Lugar) => void;
};

type EstadoRota =
  | { tipo: 'parado' }
  | { tipo: 'calculando' }
  | { tipo: 'falhou'; motivo: string }
  | { tipo: 'sem-rota' }
  | { tipo: 'pronta'; rotas: Rota[] };

export default function TelaMapa({
  textos,
  idioma,
  visivel,
  origem,
  destino,
  mudarOrigem,
  mudarDestino,
  salvarFavorito,
}: Props) {
  const t = textos.mapa;
  const [estadoRota, setEstadoRota] = useState<EstadoRota>({ tipo: 'parado' });
  const [escolhida, setEscolhida] = useState(0);
  const [trechos, setTrechos] = useState<Record<number, Resultado<Trecho[]>>>({});
  const [apoio, setApoio] = useState<Resultado<DadosDeApoio> | null>(null);
  const [luz, setLuz] = useState<Resultado<DadosDeLuz> | null>(null);
  const [mostrarApoio, setMostrarApoio] = useState(() => ler('mostrarApoio', true));
  const [perguntandoLocalizacao, setPerguntandoLocalizacao] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [apoioTocado, setApoioTocado] = useState<PontoDeApoio | null>(null);
  const [mapaFalhou, setMapaFalhou] = useState(false);

  useEffect(() => {
    carregarPontosDeApoio().then(setApoio);
    carregarLuz().then(setLuz);
  }, []);

  const rotas = estadoRota.tipo === 'pronta' ? estadoRota.rotas : [];
  const rota = rotas[escolhida];

  // Pede ao Valhalla as vias da rota escolhida (uma vez por rota), para conferir a iluminação.
  useEffect(() => {
    if (!rota || trechos[escolhida]) return;
    let ativo = true;
    pedirTrechos(rota.forma).then((resultado) => {
      if (ativo) setTrechos((anteriores) => ({ ...anteriores, [escolhida]: resultado }));
    });
    return () => {
      ativo = false;
    };
  }, [rota, escolhida, trechos]);

  const itens = useMemo(() => {
    const trechosDaRota = trechos[escolhida];
    if (!rota || !trechosDaRota || !luz || !apoio) return null;
    let iluminacao: Resultado<ResumoIluminacao>;
    if (trechosDaRota.tipo === 'falhou') iluminacao = trechosDaRota;
    else if (luz.tipo !== 'com-dado')
      iluminacao = { tipo: 'falhou', motivo: 'arquivo de iluminação' };
    else if (trechosDaRota.tipo === 'sem-dado') iluminacao = { tipo: 'sem-dado' };
    else
      iluminacao = {
        tipo: 'com-dado',
        dados: resumirIluminacao(trechosDaRota.dados, luz.dados.vias),
      };
    const pontosPerto: Resultado<number> =
      apoio.tipo === 'com-dado'
        ? {
            tipo: 'com-dado',
            dados: pontosPertoDaRota(apoio.dados.pontos, rota.pontos, RAIO_APOIO_METROS).length,
          }
        : apoio;
    return explicarRota({
      metros: rota.metros,
      segundos: rota.segundos,
      iluminacao,
      pontosPerto,
      raio: RAIO_APOIO_METROS,
    });
  }, [rota, escolhida, trechos, luz, apoio]);

  function limparRota() {
    setEstadoRota({ tipo: 'parado' });
    setTrechos({});
    setEscolhida(0);
  }

  function marcarNoMapa(ponto: Ponto) {
    const lugar = { ...ponto, rotulo: t.pontoNoMapa };
    if (!origem) mudarOrigem(lugar);
    else mudarDestino(lugar);
    setApoioTocado(null);
    limparRota();
  }

  function pedirLocalizacao() {
    setPerguntandoLocalizacao(false);
    gravar('localizacaoExplicada', true);
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setAviso(null);
        mudarOrigem({
          lat: posicao.coords.latitude,
          lon: posicao.coords.longitude,
          rotulo: t.minhaLocalizacao,
        });
        limparRota();
      },
      (erro) =>
        setAviso(
          erro.code === erro.PERMISSION_DENIED
            ? textos.localizacao.negada
            : textos.localizacao.indisponivel,
        ),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function tracarRota() {
    if (!origem || !destino) return;
    limparRota();
    setEstadoRota({ tipo: 'calculando' });
    const resultado = await pedirRotas(origem, destino);
    if (resultado.tipo === 'com-dado') setEstadoRota({ tipo: 'pronta', rotas: resultado.dados });
    else if (resultado.tipo === 'sem-dado') setEstadoRota({ tipo: 'sem-rota' });
    else setEstadoRota({ tipo: 'falhou', motivo: resultado.motivo });
  }

  const pontos = apoio?.tipo === 'com-dado' ? apoio.dados.pontos : [];

  return (
    <div className="relative h-full">
      <MapaInterativo
        origem={origem}
        destino={destino}
        rotas={rotas}
        rotaEscolhida={escolhida}
        pontosDeApoio={pontos}
        mostrarApoio={mostrarApoio}
        visivel={visivel}
        rotulo={t.rotuloMapa}
        credito={textos.app.creditoOsm}
        corrigirMapa={textos.app.corrigirMapa}
        aoTocarNoMapa={marcarNoMapa}
        aoTocarNoApoio={setApoioTocado}
        aoFalhar={() => setMapaFalhou(true)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-2 p-3">
        <BuscaDestino
          textos={t}
          aoEscolher={(lugar) => {
            mudarDestino({ lat: lugar.lat, lon: lugar.lon, rotulo: lugar.nome });
            limparRota();
          }}
        />
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            className="botao-mapa"
            onClick={() =>
              ler('localizacaoExplicada', false)
                ? pedirLocalizacao()
                : setPerguntandoLocalizacao(true)
            }
          >
            <LocateFixedIcon aria-hidden className="size-5" />
            {t.ondeEstou}
          </button>
          <button
            type="button"
            aria-pressed={mostrarApoio}
            className={`botao-mapa ${mostrarApoio ? 'border-apoio text-apoio' : ''}`}
            onClick={() => {
              gravar('mostrarApoio', !mostrarApoio);
              setMostrarApoio(!mostrarApoio);
            }}
          >
            <MapPinIcon aria-hidden className="size-5" />
            {t.pontosDeApoio}
          </button>
        </div>
      </div>

      <section className="absolute inset-x-0 bottom-0 max-h-[55%] overflow-auto rounded-t-3xl bg-painel/97 p-4 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.45)]">
        {mapaFalhou && <p className="mb-3 text-atencao">{t.mapaFalhou}</p>}
        {aviso && (
          <p className="mb-3 text-atencao" role="alert">
            {aviso}
          </p>
        )}

        {perguntandoLocalizacao && (
          <div className="mb-3 rounded-2xl border border-borda p-3">
            <h2 className="text-lg font-semibold">{textos.localizacao.titulo}</h2>
            <p className="mt-1 text-texto-suave">{textos.localizacao.explicacao}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="botao-principal" onClick={pedirLocalizacao}>
                {textos.localizacao.permitir}
              </button>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => setPerguntandoLocalizacao(false)}
              >
                {textos.localizacao.agoraNao}
              </button>
            </div>
          </div>
        )}

        {apoioTocado && (
          <div className="mb-3 rounded-2xl border border-apoio/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-apoio">
                  {textos.apoio.tipos[apoioTocado.tipo]}
                </p>
                <h2 className="text-lg font-semibold">{apoioTocado.nome}</h2>
              </div>
              <button
                type="button"
                aria-label={textos.mapa.limpar}
                className="botao-icone"
                onClick={() => setApoioTocado(null)}
              >
                <XIcon aria-hidden className="size-5" />
              </button>
            </div>
            <p className="mt-1 text-texto-suave">
              {apoioTocado.horario
                ? preencher(textos.apoio.horario, { horario: apoioTocado.horario })
                : textos.apoio.semHorario}
            </p>
            {apoioTocado.telefone && (
              <a
                className="botao-secundario mt-2"
                href={`tel:${apoioTocado.telefone.replace(/[^\d+]/g, '')}`}
              >
                {preencher(textos.apoio.ligar, { telefone: apoioTocado.telefone })}
              </a>
            )}
            <p className="mt-2 text-sm text-texto-suave">
              {preencher(textos.apoio.fonte, { fonte: apoioTocado.fonte })}
            </p>
          </div>
        )}

        <dl className="space-y-1">
          {origem && (
            <Linha
              rotulo={t.origem}
              valor={origem.rotulo}
              acao={t.limpar}
              aoAgir={() => {
                mudarOrigem(undefined);
                limparRota();
              }}
            />
          )}
          {destino && (
            <Linha
              rotulo={t.destino}
              valor={destino.rotulo}
              acao={t.limpar}
              aoAgir={() => {
                mudarDestino(undefined);
                limparRota();
              }}
            />
          )}
        </dl>
        {!origem && <p className="text-texto-suave">{t.dicaOrigem}</p>}
        {origem && !destino && <p className="text-texto-suave">{t.dicaDestino}</p>}

        {origem && destino && estadoRota.tipo !== 'pronta' && (
          <button
            type="button"
            className="botao-principal mt-3 w-full"
            onClick={tracarRota}
            disabled={estadoRota.tipo === 'calculando'}
          >
            <RouteIcon aria-hidden className="size-5" />
            {estadoRota.tipo === 'calculando' ? t.calculando : t.tracarRota}
          </button>
        )}
        {estadoRota.tipo === 'falhou' && (
          <p className="mt-2 text-atencao" role="alert">
            {t.rotaFalhou} ({estadoRota.motivo})
          </p>
        )}
        {estadoRota.tipo === 'sem-rota' && (
          <p className="mt-2 text-atencao" role="alert">
            {t.rotaSemResultado}
          </p>
        )}

        {rota && (
          <div className="mt-3 space-y-4">
            <div role="radiogroup" aria-label={t.rotaSugerida} className="grid gap-2">
              {rotas.map((r, i) => (
                <button
                  key={r.forma}
                  type="button"
                  role="radio"
                  aria-checked={i === escolhida}
                  onClick={() => setEscolhida(i)}
                  className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-left ${i === escolhida ? 'border-rota bg-rota/10' : 'border-borda'}`}
                >
                  <span className="font-semibold">
                    {i === 0 ? t.rotaSugerida : preencher(t.alternativa, { n: i })}
                  </span>
                  <span className="text-texto-suave">
                    {formatarDistancia(r.metros, idioma)} · {formatarTempo(r.segundos)}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">{t.porQue}</h2>
              {itens ? (
                <ExplicacaoRota
                  itens={itens}
                  textos={textos.explicacao}
                  idioma={idioma}
                  dadosDe={luz?.tipo === 'com-dado' ? luz.dados.dadosDe : undefined}
                />
              ) : (
                <p className="text-texto-suave">{t.verificandoLuz}</p>
              )}
            </div>

            {destino && (
              <div>
                <p className="mb-2 text-sm text-texto-suave">{t.salvarComo}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['casa', 'escola', 'projeto'] as const).map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      className="botao-secundario"
                      onClick={() => {
                        salvarFavorito(tipo, destino);
                        setAviso(t.salvo);
                      }}
                    >
                      {textos.favoritos[tipo]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ChegueiBem textos={textos.chegueiBem} />
          </div>
        )}
      </section>
    </div>
  );
}

function Linha({
  rotulo,
  valor,
  acao,
  aoAgir,
}: {
  rotulo: string;
  valor: string;
  acao: string;
  aoAgir: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <dt className="text-sm text-texto-suave">{rotulo}</dt>
        <dd className="truncate text-base">{valor}</dd>
      </div>
      <button type="button" className="botao-secundario shrink-0 px-3" onClick={aoAgir}>
        {acao}
      </button>
    </div>
  );
}
