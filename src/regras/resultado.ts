// Os três jeitos de uma consulta terminar. "Falhou" (não deu para consultar) é diferente de
// "sem dado" (consultou, mas a informação não existe), e a tela precisa dizer qual dos dois.
export type Resultado<T> =
  { tipo: 'com-dado'; dados: T } | { tipo: 'sem-dado' } | { tipo: 'falhou'; motivo: string };
