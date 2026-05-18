import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

type Situacao = 'Cursando' | 'Aprovado' | 'Reprovado';

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

type DisciplinaForm = Pick<
  Disciplina,
  'disciplina' | 'segundo_semestre' | 'carga_horaria' | 'situacao'
>;

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './app.html',
})
export class App {
  situacaoOptions: Array<{ label: string; value: Situacao }> = [
    { label: 'Cursando', value: 'Cursando' },
    { label: 'Aprovado', value: 'Aprovado' },
    { label: 'Reprovado', value: 'Reprovado' },
  ];

  disciplinas: Disciplina[] = [
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
  ];

  formData: DisciplinaForm = this.emptyForm();
  editingIndex: number | null = null;

  saveDisciplina(): void {
    if (!this.formData.disciplina.trim()) {
      return;
    }

    const prepared =
      this.editingIndex === null
        ? this.buildDisciplina(this.formData)
        : this.buildDisciplina({
            ...this.disciplinas[this.editingIndex],
            ...this.formData,
          });

    if (this.editingIndex === null) {
      this.disciplinas = [...this.disciplinas, prepared];
    } else {
      this.disciplinas = this.disciplinas.map((item, index) =>
        index === this.editingIndex ? prepared : item,
      );
    }

    this.resetForm();
  }

  startEdit(index: number): void {
    const target = this.disciplinas[index];
    this.formData = {
      disciplina: target.disciplina,
      segundo_semestre: target.segundo_semestre,
      carga_horaria: target.carga_horaria,
      situacao: target.situacao,
    };
    this.editingIndex = index;
  }

  deleteDisciplina(index: number): void {
    this.disciplinas = this.disciplinas.filter((_, idx) => idx !== index);
    if (this.editingIndex === index) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = this.emptyForm();
    this.editingIndex = null;
  }

  onNotasChange(disciplina: Disciplina): void {
    disciplina.media_disciplina = this.calculateMedia(disciplina);
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
      carga_horaria: 0,
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
