import { Injectable, computed, signal } from '@angular/core';
import { Disciplina, DisciplinaForm } from './disciplina.model';

@Injectable({
  providedIn: 'root',
})
export class DisciplinaService {
  private readonly disciplinasSignal = signal<Disciplina[]>([]);

  readonly disciplinas = computed(() => this.disciplinasSignal());

  create(payload: DisciplinaForm): void {
    const disciplina = this.buildDisciplina({
      id: crypto.randomUUID(),
      disciplina: payload.disciplina.trim(),
      carga_horaria: payload.carga_horaria ?? 0,
      situacao: payload.situacao,
      segundo_semestre: payload.segundo_semestre,
    });

    this.disciplinasSignal.update((items) => [...items, disciplina]);
  }

  update(id: string, payload: DisciplinaForm): void {
    this.disciplinasSignal.update((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return this.buildDisciplina({
          ...item,
          disciplina: payload.disciplina.trim(),
          carga_horaria: payload.carga_horaria ?? 0,
          situacao: payload.situacao,
          segundo_semestre: payload.segundo_semestre,
        });
      }),
    );
  }

  delete(id: string): void {
    this.disciplinasSignal.update((items) =>
      items.filter((item) => item.id != id),
    );
  }

  findById(id: string): Disciplina | undefined {
    return this.disciplinasSignal().find(
      (disciplina) => disciplina.id == id,
    );
  }

  updateNotas(
    id: string,
    updater: (
      disciplina: Disciplina,
    ) => Partial<
      Pick<
        Disciplina,
        | 'nota_etapa_1'
        | 'nota_etapa_2'
        | 'nota_etapa_3'
        | 'nota_etapa_4'
      >
    >,
  ): void {
    this.disciplinasSignal.update((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return this.buildDisciplina({
          ...item,
          ...updater(item),
        });
      }),
    );
  }

  private emptyDisciplina(): Disciplina {
    return {
      id: crypto.randomUUID(),
      disciplina: '',
      segundo_semestre: false,
      carga_horaria: 0,
      situacao: 'Cursando',
      nota_etapa_1: { nota: null, faltas: 0 },
      nota_etapa_2: { nota: null, faltas: 0 },
      nota_etapa_3: { nota: null, faltas: 0 },
      nota_etapa_4: { nota: null, faltas: 0 },
      media_disciplina: null,
    };
  }

  private buildDisciplina(
    partial: Partial<Disciplina>,
  ): Disciplina {
    const base = this.emptyDisciplina();

    const disciplina: Disciplina = {
      ...base,
      ...partial,

      nota_etapa_1: {
        ...base.nota_etapa_1,
        ...partial.nota_etapa_1,
      },

      nota_etapa_2: {
        ...base.nota_etapa_2,
        ...partial.nota_etapa_2,
      },

      nota_etapa_3: {
        ...base.nota_etapa_3,
        ...partial.nota_etapa_3,
      },

      nota_etapa_4: {
        ...base.nota_etapa_4,
        ...partial.nota_etapa_4,
      },
    };

    return {
      ...disciplina,
      media_disciplina: this.calculateMedia(disciplina),
    };
  }

  private calculateMedia(
    disciplina: Disciplina,
  ): number | null {
    const notas = [
      disciplina.nota_etapa_1.nota,
      disciplina.nota_etapa_2.nota,
      disciplina.nota_etapa_3.nota,
      disciplina.nota_etapa_4.nota,
    ].filter(
      (nota): nota is number =>
        nota !== null && !Number.isNaN(nota),
    );

    if (notas.length === 0) {
      return null;
    }

    const soma = notas.reduce((acc, nota) => acc + nota, 0);

    return Math.round((soma / notas.length) * 10) / 10;
  }
}