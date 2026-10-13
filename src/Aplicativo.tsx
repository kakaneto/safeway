// Componente principal: guarda o idioma, a tela aberta, a saída, a chegada e os favoritos,
// e desenha a barra de cima e a navegação de baixo. As telas ficam montadas para o mapa não recomeçar.
import { useEffect, useState } from 'react';
import { LockIcon, MapIcon, PhoneIcon, StarIcon } from 'lucide-react';
import TelaMapa, { type Lugar, type TipoFavorito } from './telas/mapa/TelaMapa.tsx';
import TelaAjudaAgora from './telas/ajuda-agora/TelaAjudaAgora.tsx';
import TelaFavoritos from './telas/favoritos/TelaFavoritos.tsx';
import TelaPrivacidade from './telas/privacidade/TelaPrivacidade.tsx';
import { escolherIdioma, type Idioma } from './regras/escolherIdioma.ts';
import { pegarTextos } from './textos/textos.ts';
import { apagarTudo, gravar, ler } from './servicos/armazenamento.ts';

type Tela = 'mapa' | 'ajuda' | 'favoritos' | 'privacidade';
type Favoritos = Partial<Record<TipoFavorito, Lugar>>;

const idiomaDoNavegador = () => escolherIdioma(navigator.languages);

export default function Aplicativo() {
  const [idioma, setIdioma] = useState<Idioma>(() => ler('idioma', idiomaDoNavegador()));
  const [tela, setTela] = useState<Tela>('mapa');
  const [origem, setOrigem] = useState<Lugar>();
  const [destino, setDestino] = useState<Lugar>();
  const [favoritos, setFavoritos] = useState<Favoritos>(() => ler('favoritos', {}));
  const [aviso, setAviso] = useState<string | null>(null);
  const textos = pegarTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma;
    document.title = textos.app.nome;
  }, [idioma, textos]);

  function trocarIdioma() {
    const novo = idioma === 'pt-BR' ? 'es' : 'pt-BR';
    gravar('idioma', novo);
    setIdioma(novo);
  }

  function mudarFavoritos(novos: Favoritos) {
    gravar('favoritos', novos);
    setFavoritos(novos);
  }

  function apagarTudoDoAparelho() {
    apagarTudo();
    setFavoritos({});
    setIdioma(idiomaDoNavegador());
    setAviso(pegarTextos(idiomaDoNavegador()).favoritos.apagado);
  }

  const abas = [
    { id: 'mapa', rotulo: textos.navegacao.mapa, Icone: MapIcon },
    { id: 'ajuda', rotulo: textos.navegacao.ajuda, Icone: PhoneIcon },
    { id: 'favoritos', rotulo: textos.navegacao.favoritos, Icone: StarIcon },
    { id: 'privacidade', rotulo: textos.navegacao.privacidade, Icone: LockIcon },
  ] as const;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-borda px-4">
        <p className="text-lg font-bold tracking-wide">{textos.app.nome}</p>
        <button
          type="button"
          onClick={trocarIdioma}
          aria-label={textos.idioma.trocarDescricao}
          lang={idioma === 'pt-BR' ? 'es' : 'pt-BR'}
          className="min-h-12 rounded-xl px-3 font-semibold text-rota"
        >
          {textos.idioma.trocar}
        </button>
      </header>

      <main className="relative min-h-0 flex-1">
        <div hidden={tela !== 'mapa'} className="h-full">
          <TelaMapa
            textos={textos}
            idioma={idioma}
            visivel={tela === 'mapa'}
            origem={origem}
            destino={destino}
            mudarOrigem={setOrigem}
            mudarDestino={setDestino}
            salvarFavorito={(tipo, lugar) => mudarFavoritos({ ...favoritos, [tipo]: lugar })}
          />
        </div>
        <div hidden={tela !== 'ajuda'} className="h-full overflow-auto">
          <TelaAjudaAgora textos={textos} />
        </div>
        <div hidden={tela !== 'favoritos'} className="h-full overflow-auto">
          <TelaFavoritos
            textos={textos.favoritos}
            favoritos={favoritos}
            aviso={aviso}
            irPara={(lugar) => {
              setDestino(lugar);
              setTela('mapa');
            }}
            remover={(tipo) => {
              const resto = { ...favoritos };
              delete resto[tipo];
              mudarFavoritos(resto);
            }}
            apagarTudo={apagarTudoDoAparelho}
          />
        </div>
        <div hidden={tela !== 'privacidade'} className="h-full overflow-auto">
          <TelaPrivacidade textos={textos} apagarTudo={apagarTudoDoAparelho} />
        </div>
      </main>

      <nav
        aria-label={textos.navegacao.rotulo}
        className="grid shrink-0 grid-cols-4 border-t border-borda bg-painel pb-[env(safe-area-inset-bottom)]"
      >
        {abas.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            type="button"
            aria-current={tela === id ? 'page' : undefined}
            onClick={() => {
              setAviso(null);
              setTela(id);
            }}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${
              tela === id ? 'text-rota' : 'text-texto-suave'
            } ${id === 'ajuda' ? 'text-texto' : ''}`}
          >
            <Icone aria-hidden className={`size-6 ${id === 'ajuda' ? 'text-atencao' : ''}`} />
            {rotulo}
          </button>
        ))}
      </nav>
    </div>
  );
}
