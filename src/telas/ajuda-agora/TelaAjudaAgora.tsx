// Tela "Ajuda agora": botões para ligar para emergência, alertas da Defesa Civil e números da fronteira.
// Não depende de internet: fica guardada no aparelho pelo PWA e as ligações saem pelo próprio celular.
import { useState } from 'react';
import { PhoneIcon } from 'lucide-react';
import ChegueiBem from '../../componentes/ChegueiBem.tsx';
import type { Textos } from '../../textos/textos.ts';

// Números oficiais (Anatel) e do Conselho Tutelar de Foz (site da Prefeitura, conferidos em 13/10/2026).
const NUMEROS = [
  { chave: 'pm', numero: '190' },
  { chave: 'samu', numero: '192' },
  { chave: 'bombeiros', numero: '193' },
  { chave: 'defesaCivil', numero: '199' },
  { chave: 'direitosHumanos', numero: '100' },
  { chave: 'mulher', numero: '180' },
  { chave: 'cvv', numero: '188' },
  { chave: 'conselho1', numero: '(45) 2105-8633' },
  { chave: 'conselho2', numero: '(45) 3901-3265' },
] as const;

export default function TelaAjudaAgora({ textos }: { textos: Textos }) {
  const t = textos.ajuda;
  const [cep, setCep] = useState('');
  const cepLimpo = cep.replace(/\D/g, '').slice(0, 8);

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 pb-10">
      <header>
        <h1 className="text-2xl font-bold">{t.titulo}</h1>
        <p className="mt-1 text-texto-suave">{t.intro}</p>
      </header>

      <ul className="grid gap-2">
        {NUMEROS.map(({ chave, numero }) => (
          <li key={chave}>
            <a
              href={`tel:${numero.replace(/\D/g, '')}`}
              className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-borda bg-painel px-4 py-2"
            >
              <span className="flex items-center gap-3">
                <PhoneIcon aria-hidden className="size-5 text-rota" />
                <span className="text-base">{t.numeros[chave]}</span>
              </span>
              <span className="text-lg font-bold whitespace-nowrap tabular-nums">{numero}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-texto-suave">{t.fonteConselho}</p>

      <section className="space-y-2 rounded-2xl border border-borda p-4">
        <h2 className="text-lg font-semibold">{t.alertasTitulo}</h2>
        <p>{t.alertasSms}</p>
        <label htmlFor="cep" className="block text-sm text-texto-suave">
          {t.cepRotulo}
        </label>
        <input
          id="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          className="h-12 w-full rounded-xl border border-borda bg-fundo px-3 text-base tabular-nums"
        />
        <a className="botao-principal w-full" href={`sms:40199?body=${cepLimpo}`}>
          {t.enviarSms}
        </a>
        <p className="pt-2">{t.alertasWhatsapp}</p>
        <a
          className="botao-secundario w-full"
          href="https://wa.me/556120344611"
          target="_blank"
          rel="noreferrer"
        >
          {t.abrirWhatsapp}
        </a>
      </section>

      <section className="space-y-2 rounded-2xl border border-atencao/50 p-4">
        <h2 className="text-lg font-semibold text-atencao">{t.fronteiraTitulo}</h2>
        <p>{t.fronteiraTexto}</p>
        <p>{t.paraguai}</p>
        <p>{t.argentina}</p>
      </section>

      <ChegueiBem textos={textos.chegueiBem} />
      <p className="text-sm text-texto-suave">{t.naoSubstitui}</p>
    </div>
  );
}
