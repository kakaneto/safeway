// Tela "Favoritos": casa, escola e projeto, guardados só no aparelho, com o botão "apagar tudo".
import { StarIcon, Trash2Icon } from 'lucide-react';
import { preencher } from '../../regras/formatar.ts';
import type { Textos } from '../../textos/textos.ts';
import type { Lugar, TipoFavorito } from '../mapa/TelaMapa.tsx';

type Props = {
  textos: Textos['favoritos'];
  favoritos: Partial<Record<TipoFavorito, Lugar>>;
  irPara: (lugar: Lugar) => void;
  remover: (tipo: TipoFavorito) => void;
  apagarTudo: () => void;
  aviso: string | null;
};

export default function TelaFavoritos({
  textos,
  favoritos,
  irPara,
  remover,
  apagarTudo,
  aviso,
}: Props) {
  return (
    <div className="mx-auto max-w-xl space-y-4 p-4 pb-10">
      <header>
        <h1 className="text-2xl font-bold">{textos.titulo}</h1>
        <p className="mt-1 text-texto-suave">{textos.intro}</p>
      </header>
      {aviso && (
        <p role="status" className="text-rota">
          {aviso}
        </p>
      )}
      <ul className="grid gap-3">
        {(['casa', 'escola', 'projeto'] as const).map((tipo) => {
          const lugar = favoritos[tipo];
          const nome = textos[tipo];
          return (
            <li key={tipo} className="rounded-2xl border border-borda bg-painel p-4">
              <p className="flex items-center gap-2 text-lg font-semibold">
                <StarIcon aria-hidden className="size-5 text-luz" />
                {nome}
              </p>
              {lugar ? (
                <>
                  <p className="mt-1 truncate text-texto-suave">{lugar.rotulo}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" className="botao-principal" onClick={() => irPara(lugar)}>
                      {preencher(textos.irPara, { nome })}
                    </button>
                    <button
                      type="button"
                      className="botao-secundario"
                      onClick={() => remover(tipo)}
                    >
                      {textos.remover}
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-texto-suave">{preencher(textos.vazio, { nome })}</p>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="botao-secundario w-full"
        onClick={() => window.confirm(textos.confirmarApagar) && apagarTudo()}
      >
        <Trash2Icon aria-hidden className="size-5" />
        {textos.apagarTudo}
      </button>
    </div>
  );
}
