import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, form, min, required } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

type Situacao = 'Cursando' | 'Aprovado' | 'Reprovado';

interface FormProgress {
  total: number;
  remaining: number;
}

interface EtapaNota {
  nota: number | null;
  faltas: number;
}

interface Disciplina {
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

interface DisciplinaForm {
  disciplina: string;
  segundo_semestre: boolean;
  carga_horaria: number | null;
  situacao: Situacao;
}


@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    FormField,
    ButtonModule,
    CardModule,
    InputNumberModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './app.html',
})
export class App {
  readonly situacaoOptions: Array<{ label: string; value: Situacao }> = [
    { label: 'Cursando', value: 'Cursando' },
    { label: 'Aprovado', value: 'Aprovado' },
    { label: 'Reprovado', value: 'Reprovado' },
  ];

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

  readonly disciplinaModel = signal<DisciplinaForm>(this.emptyForm());
  readonly disciplinaForm = form(this.disciplinaModel, (schema) => {
    required(schema.disciplina);
    min(schema.carga_horaria, 1);
  });

  readonly editingIndex = signal<number | null>(null);
  readonly submitAttempted = signal(false);

  readonly formProgress = computed<FormProgress>(() => {
    const disciplina = this.disciplinaForm.disciplina().value().trim();
    const cargaHoraria = this.disciplinaForm.carga_horaria().value();
    const total = 2;
    const filled = Number(disciplina.length > 0) + Number((cargaHoraria ?? 0) >= 1);
    const remaining = total - filled;
    return { total, remaining,};
  });

  readonly formFeedback = computed<{ severity: string; text: string; }>(() => {
    const { remaining, total } = this.formProgress();
    if (this.editingIndex() != null){
      return { severity: 'info', text: `Editando os dados da disciplina.`, };
    }
    if (remaining === 0) {
      return { severity: 'success', text: 'Formulario pronto para salvar.' };
    }
    if (remaining === total) {
      return { severity: 'warn', text: 'Comece preenchendo os campos obrigatorios.',};
    }
    return {
      severity: 'info', text: `Faltam ${remaining} campo(s) obrigatorio(s).`, };
  });

  readonly feedbackClass = computed(() => {
    const base = 'rounded-xl border px-4 py-3 text-sm';
    const severity = this.formFeedback().severity;
    if (severity === 'success') {
      return `${base} border-emerald-200 bg-emerald-50 text-emerald-800`;
    }
    if (severity === 'warn') {
      return `${base} border-amber-200 bg-amber-50 text-amber-800`;
    }
    return `${base} border-blue-200 bg-blue-50 text-blue-800`;
  });

  readonly canSubmit = computed(() => this.formProgress().remaining === 0);
  readonly showDisciplinaError = computed(
    () => this.submitAttempted() && !this.disciplinaForm.disciplina().value().trim(),
  );
  readonly showCargaError = computed(() => {
    if (!this.submitAttempted()) {
      return false;
    }
    const cargaHoraria = this.disciplinaForm.carga_horaria().value();
    return (cargaHoraria ?? 0) < 1;
  });

  saveDisciplina(): void {
    this.submitAttempted.set(true);
    if (!this.canSubmit()) {
      return;
    }

    const raw = this.disciplinaModel();
    const formValue: Partial<Disciplina> = {
      situacao: raw.situacao,
      segundo_semestre: raw.segundo_semestre,
      disciplina: raw.disciplina.trim(),
      carga_horaria: raw.carga_horaria ?? 0,
    };
    const editingIndex = this.editingIndex();
    let prepared: Disciplina;
    if (editingIndex === null) {
      prepared = this.buildDisciplina(formValue);
    } else {
      prepared = this.buildDisciplina({
        ...this.disciplinas()[editingIndex],
        ...formValue,
      });
    }

    if (editingIndex === null) {
      this.disciplinas.update((items) => [...items, prepared]);
    } else {
      this.disciplinas.update((items) =>
        items.map((item, index) => (index === editingIndex ? prepared : item)),
      );
    }

    this.resetForm();
  }

  startEdit(index: number): void {
    const target = this.disciplinas()[index];
    this.disciplinaModel.set({
      disciplina: target.disciplina,
      segundo_semestre: target.segundo_semestre,
      carga_horaria: target.carga_horaria,
      situacao: target.situacao,
    });
    this.editingIndex.set(index);
    this.submitAttempted.set(false);
  }

  deleteDisciplina(index: number): void {
    this.disciplinas.update((items) => items.filter((_, idx) => idx !== index));
    if (this.editingIndex() === index) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.disciplinaModel.set(this.emptyForm());
    this.editingIndex.set(null);
    this.submitAttempted.set(false);
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

  formatMedia(media: number | null): string {
    return media === null ? '-' : media.toFixed(1);
  }

  statusSeverity(status: Situacao): 'success' | 'warn' | 'danger' {
    if (status === 'Aprovado') {
      return 'success';
    }
    if (status === 'Reprovado') {
      return 'danger';
    }
    return 'warn';
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

  private emptyForm(): DisciplinaForm {
    return {
      disciplina: '',
      segundo_semestre: false,
      carga_horaria: null,
      situacao: 'Cursando',
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
