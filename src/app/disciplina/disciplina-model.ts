export type Situacao = 'Cursando' | 'Aprovado' | 'Reprovado';

export interface EtapaNota {
  nota: number | null;
  faltas: number;
}

export interface Disciplina {
  disciplina: string;
  segundo_semestre: boolean;
  carga_horaria: number;
  situacao: Situacao;

  nota_etapa_1: EtapaNota;
  nota_etapa_2: EtapaNota;
  nota_etapa_3: EtapaNota;
  nota_etapa_4: EtapaNota;

  media_disciplina: number | null;
}

export interface DisciplinaForm {
  disciplina: string;
  segundo_semestre: boolean;
  carga_horaria: number | null;
  situacao: Situacao;
}
