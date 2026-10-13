// Componente principal do app. Por enquanto mostra só o aviso de "em construção";
// as telas da fase 1 entram aqui depois que o plano for aprovado.
import { useEffect } from 'react';
import { escolherIdioma } from './regras/escolherIdioma.ts';
import { pegarTextos } from './textos/textos.ts';

const idioma = escolherIdioma(navigator.languages);
const textos = pegarTextos(idioma);

export default function Aplicativo() {
  useEffect(() => {
    document.documentElement.lang = idioma;
    document.title = textos.app.nome;
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-3xl font-bold">{textos.app.nome}</h1>
      <p className="text-lg">{textos.app.descricao}</p>
      <p role="status">{textos.emConstrucao.aviso}</p>
    </main>
  );
}
