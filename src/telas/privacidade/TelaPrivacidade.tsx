// Tela "Privacidade": em linguagem simples, o que o app guarda, o que nunca guarda e o que sai do aparelho.
import { Trash2Icon } from 'lucide-react';
import type { Textos } from '../../textos/textos.ts';

export default function TelaPrivacidade({
  textos,
  apagarTudo,
}: {
  textos: Textos;
  apagarTudo: () => void;
}) {
  const t = textos.privacidade;
  return (
    <div className="mx-auto max-w-xl space-y-5 p-4 pb-10">
      <h1 className="text-2xl font-bold">{t.titulo}</h1>
      <section>
        <h2 className="text-lg font-semibold">{t.guardaTitulo}</h2>
        <p className="mt-1">{t.guarda}</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold">{t.nuncaTitulo}</h2>
        <p className="mt-1">{t.nunca}</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold">{t.enviaTitulo}</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>{t.envioMapa}</li>
          <li>{t.envioBusca}</li>
          <li>{t.envioRota}</li>
          <li>{t.envioCelular}</li>
        </ul>
      </section>
      <p className="text-texto-suave">{t.leis}</p>
      <button
        type="button"
        className="botao-secundario w-full"
        onClick={() => window.confirm(textos.favoritos.confirmarApagar) && apagarTudo()}
      >
        <Trash2Icon aria-hidden className="size-5" />
        {textos.favoritos.apagarTudo}
      </button>
    </div>
  );
}
