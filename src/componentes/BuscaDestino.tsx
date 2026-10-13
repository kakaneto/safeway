// Campo de busca do destino com sugestões enquanto a pessoa digita (Photon).
// Espera a pessoa parar de digitar e só busca com 3 letras ou mais, para não sobrecarregar o serviço.
import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { buscarLugares, type Lugar } from '../servicos/photon.ts';
import type { Textos } from '../textos/textos.ts';

type Estado =
  | { tipo: 'parado' }
  | { tipo: 'buscando' }
  | { tipo: 'falhou' }
  | { tipo: 'vazio' }
  | { tipo: 'pronto'; lugares: Lugar[] };

export default function BuscaDestino({
  textos,
  aoEscolher,
}: {
  textos: Textos['mapa'];
  aoEscolher: (lugar: Lugar) => void;
}) {
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<Estado>({ tipo: 'parado' });
  const [escolhido, setEscolhido] = useState('');

  useEffect(() => {
    if (texto.trim().length < 3 || texto === escolhido) return;
    const controle = new AbortController();
    const espera = setTimeout(async () => {
      setEstado({ tipo: 'buscando' });
      try {
        const resultado = await buscarLugares(texto.trim(), controle.signal);
        if (resultado.tipo === 'com-dado') setEstado({ tipo: 'pronto', lugares: resultado.dados });
        else setEstado({ tipo: resultado.tipo === 'falhou' ? 'falhou' : 'vazio' });
      } catch {
        // Busca cancelada porque a pessoa continuou digitando.
      }
    }, 450);
    return () => {
      clearTimeout(espera);
      controle.abort();
    };
  }, [texto, escolhido]);

  function escolher(lugar: Lugar) {
    aoEscolher(lugar);
    setEscolhido(lugar.nome);
    setTexto(lugar.nome);
    setEstado({ tipo: 'parado' });
  }

  return (
    <div className="pointer-events-auto rounded-2xl bg-painel/95 p-2 shadow-lg shadow-black/40 backdrop-blur">
      <label htmlFor="busca-destino" className="sr-only">
        {textos.buscarRotulo}
      </label>
      <div className="flex items-center gap-2 rounded-xl bg-fundo px-3">
        <SearchIcon aria-hidden className="size-5 shrink-0 text-texto-suave" />
        <input
          id="busca-destino"
          type="search"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (e.target.value.trim().length < 3) setEstado({ tipo: 'parado' });
          }}
          placeholder={textos.buscarDica}
          autoComplete="off"
          className="h-12 w-full bg-transparent text-base text-texto placeholder:text-texto-suave focus:outline-none"
        />
      </div>
      <div aria-live="polite">
        {estado.tipo === 'buscando' && (
          <p className="px-3 py-2 text-sm text-texto-suave">{textos.buscando}</p>
        )}
        {estado.tipo === 'vazio' && (
          <p className="px-3 py-2 text-sm text-atencao">{textos.buscaSemResultado}</p>
        )}
        {estado.tipo === 'falhou' && (
          <p className="px-3 py-2 text-sm text-atencao">{textos.buscaFalhou}</p>
        )}
      </div>
      {estado.tipo === 'pronto' && (
        <ul className="mt-1 max-h-64 overflow-auto">
          {estado.lugares.map((lugar) => (
            <li key={`${lugar.lat},${lugar.lon},${lugar.nome}`}>
              <button
                type="button"
                onClick={() => escolher(lugar)}
                className="flex min-h-12 w-full flex-col justify-center rounded-lg px-3 py-2 text-left hover:bg-fundo"
              >
                <span className="text-base text-texto">{lugar.nome}</span>
                {lugar.detalhe && <span className="text-sm text-texto-suave">{lugar.detalhe}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
