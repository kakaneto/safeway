// Botão "Cheguei bem": abre o compartilhamento do próprio celular (WhatsApp, SMS...) com a mensagem pronta.
// Nada passa por servidor nosso: quem escolhe para quem mandar é a pessoa.
import { useState } from 'react';
import { MessageSquareIcon } from 'lucide-react';
import type { Textos } from '../textos/textos.ts';

export default function ChegueiBem({ textos }: { textos: Textos['chegueiBem'] }) {
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const mensagem = encodeURIComponent(textos.mensagem);

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({ text: textos.mensagem });
        return;
      } catch (erro) {
        if ((erro as Error).name === 'AbortError') return;
      }
    }
    setMostrarOpcoes(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={compartilhar}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-texto px-4 font-semibold text-fundo"
      >
        <MessageSquareIcon aria-hidden className="size-5" />
        {textos.botao}
      </button>
      <p className="mt-1 text-sm text-texto-suave">{textos.explicacao}</p>
      {mostrarOpcoes && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <a
            className="botao-secundario"
            href={`https://wa.me/?text=${mensagem}`}
            target="_blank"
            rel="noreferrer"
          >
            {textos.whatsapp}
          </a>
          <a className="botao-secundario" href={`sms:?body=${mensagem}`}>
            {textos.sms}
          </a>
        </div>
      )}
    </div>
  );
}
