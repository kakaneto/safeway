// Soma quantos metros de uma rota têm registro de luz, registro de "sem luz" ou nenhum registro.
// Rua sem a etiqueta "lit" no mapa é "sem dado", nunca "apagada" (regra 5 do AGENTS.md).
export type Trecho = { viaId: number; metros: number };
export type MapaDeLuz = Record<string, string>;
export type ResumoIluminacao = { comLuz: number; semLuz: number; semDado: number; total: number };

const COM_LUZ = new Set(['yes', '24/7', 'automatic', 'dusk-dawn', 'sunset-sunrise']);
const SEM_LUZ = new Set(['no', 'disused']);

export function resumirIluminacao(trechos: Trecho[], luz: MapaDeLuz): ResumoIluminacao {
  const resumo = { comLuz: 0, semLuz: 0, semDado: 0, total: 0 };
  for (const trecho of trechos) {
    const valor = luz[String(trecho.viaId)];
    if (valor && COM_LUZ.has(valor)) resumo.comLuz += trecho.metros;
    else if (valor && SEM_LUZ.has(valor)) resumo.semLuz += trecho.metros;
    else resumo.semDado += trecho.metros; // inclui valores parciais como "limited"
    resumo.total += trecho.metros;
  }
  return resumo;
}
