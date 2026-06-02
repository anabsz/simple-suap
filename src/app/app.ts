import { Component, computed, signal } from '@angular/core';
import { Disciplina, DisciplinaForm } from './disciplina/disciplina-model';
import { DisciplinaFormComponent } from './disciplina/form/form';
import { DisciplinaTableComponent } from './disciplina/table/table';


@Component({
  selector: 'app-root',
  imports: [
    DisciplinaFormComponent,
    DisciplinaTableComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  readonly disciplinas = signal<Disciplina[]>([
    this.buildDisciplina({
      disciplina: 'Programação',
      segundo_semestre: true,
      carga_horaria: 80,
      situacao: 'Cursando',
      nota_etapa_1: { nota: 78, faltas: 2 },
      nota_etapa_2: { nota: 86, faltas: 1 },
    }),
    this.buildDisciplina({
      disciplina: 'Banco de Dados',
      segundo_semestre: false,
      carga_horaria: 60,
      situacao: 'Aprovado',
      nota_etapa_1: { nota: 90, faltas: 0 },
      nota_etapa_2: { nota: 88, faltas: 1 },
      nota_etapa_3: { nota: 92, faltas: 0 },
    }),
  ]);

  readonly editingIndex = signal<number | null>(null);
  readonly editingDisciplina = computed<Disciplina | null>(() => {
    const index = this.editingIndex();
    if (index === null) {
      return null;
    }
    return this.disciplinas()[index] ?? null;
  });

  saveDisciplina(payload: DisciplinaForm): void {
    const formValue: Partial<Disciplina> = {
      situacao: payload.situacao,
      segundo_semestre: payload.segundo_semestre,
      disciplina: payload.disciplina.trim(),
      carga_horaria: payload.carga_horaria ?? 0,
    };
    const editingIndex = this.editingIndex();
    const current = editingIndex === null ? null : this.disciplinas()[editingIndex];
    const prepared = this.buildDisciplina({
      ...(current ?? {}),
      ...formValue,
    });

    if (editingIndex === null || !current) {
      this.disciplinas.update((items) => [...items, prepared]);
    } else {
      this.disciplinas.update((items) =>
        items.map((item, index) => (index === editingIndex ? prepared : item)),
      );
    }

    this.resetForm();
  }

  startEdit(index: number): void {
    this.editingIndex.set(index);
  }

  deleteDisciplina(index: number): void {
    this.disciplinas.update((items) => items.filter((_, idx) => idx !== index));
    if (this.editingIndex() === index) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingIndex.set(null);
  }

  onNotasChange(disciplina: Disciplina): void {
    this.disciplinas.update((items) =>
      items.map((item) => {
        if (item !== disciplina) {
          return item;
        }
        return {
          ...item,
          media_disciplina: this.calculateMedia(item),
        };
      }),
    );
  }

  private emptyDisciplina(): Disciplina {
    return {
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

  private buildDisciplina(partial: Partial<Disciplina>): Disciplina {
    const base = this.emptyDisciplina();
    const merged: Disciplina = {
      ...base,
      ...partial,
      nota_etapa_1: { ...base.nota_etapa_1, ...partial.nota_etapa_1 },
      nota_etapa_2: { ...base.nota_etapa_2, ...partial.nota_etapa_2 },
      nota_etapa_3: { ...base.nota_etapa_3, ...partial.nota_etapa_3 },
      nota_etapa_4: { ...base.nota_etapa_4, ...partial.nota_etapa_4 },
    };

    merged.media_disciplina = this.calculateMedia(merged);
    return merged;
  }

  private calculateMedia(disciplina: Disciplina): number | null {
    const notas = [
      disciplina.nota_etapa_1.nota,
      disciplina.nota_etapa_2.nota,
      disciplina.nota_etapa_3.nota,
      disciplina.nota_etapa_4.nota,
    ].filter((nota): nota is number => nota !== null && !Number.isNaN(nota));

    if (notas.length === 0) {
      return null;
    }

    const soma = notas.reduce((acc, nota) => acc + nota, 0);
    return Math.round((soma / notas.length) * 10) / 10;
  }
}
