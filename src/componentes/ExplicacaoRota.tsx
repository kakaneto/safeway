// Transforma os itens da regra explicarRota em frases no idioma escolhido ("Por que esta rota").
import type { ItemExplicacao } from '../regras/explicarRota.ts';
import { formatarDistancia, formatarTempo, preencher } from '../regras/formatar.ts';
import type { Idioma } from '../regras/escolherIdioma.ts';
import type { Textos } from '../textos/textos.ts';

function frase(item: ItemExplicacao, t: Textos['explicacao'], idioma: Idioma): string {
  switch (item.tipo) {
    case 'distancia':
      return preencher(t.distancia, {
        distancia: formatarDistancia(item.metros, idioma),
        tempo: formatarTempo(item.segundos),
      });
    case 'preferencia-luz':
      return t.preferenciaLuz;
    case 'iluminacao-falhou':
      return t.iluminacaoFalhou;
    case 'iluminacao-insuficiente':
      return preencher(t.iluminacaoInsuficiente, { semDado: item.semDado });
    case 'iluminacao':
      return preencher(t.iluminacao, item);
    case 'apoio-falhou':
      return t.apoioFalhou;
    case 'apoio-nenhum':
      return preencher(t.apoioNenhum, { raio: item.raio });
    case 'apoio':
      return preencher(t.apoio, { n: item.quantidade, raio: item.raio });
    case 'aviso':
      return t.aviso;
  }
}

export default function ExplicacaoRota(props: {
  itens: ItemExplicacao[];
  textos: Textos['explicacao'];
  idioma: Idioma;
  dadosDe?: string;
}) {
  return (
    <ul className="space-y-2 text-base">
      {props.itens.map((item) => (
        <li
          key={item.tipo}
          className={
            item.tipo.startsWith('iluminacao')
              ? 'text-luz'
              : item.tipo === 'aviso'
                ? 'text-atencao'
                : ''
          }
        >
          {frase(item, props.textos, props.idioma)}
        </li>
      ))}
      {props.dadosDe && (
        <li className="text-sm text-texto-suave">
          {preencher(props.textos.fonte, {
            data: new Date(props.dadosDe).toLocaleDateString(props.idioma),
          })}
        </li>
      )}
    </ul>
  );
}
