import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, form, min, required } from '@angular/forms/signals';
import { CardModule } from 'primeng/card';
import { Disciplina, DisciplinaForm, Situacao } from '../disciplina-model';


@Component({
  selector: 'app-disciplina-form',
  imports: [CardModule, FormField, FormsModule],
  templateUrl: './form.html',
})
export class DisciplinaFormComponent implements OnChanges {
  @Input() editingDisciplina: Disciplina | null = null;
  @Output() save = new EventEmitter<DisciplinaForm>();
  @Output() cancel = new EventEmitter<void>();

  readonly situacaoOptions: Array<{ label: string; value: Situacao }> = [
    { label: 'Cursando', value: 'Cursando' },
    { label: 'Aprovado', value: 'Aprovado' },
    { label: 'Reprovado', value: 'Reprovado' },
  ];

  readonly disciplinaModel = signal<DisciplinaForm>(this.emptyForm());
  
  readonly disciplinaForm = form(this.disciplinaModel, (schema) => {
    required(schema.disciplina);
    required(schema.carga_horaria);
    min(schema.carga_horaria, 1);
  });

  readonly isEditing = signal(false);

  readonly feedbackClass = computed(() => {
    const base = 'rounded-xl border px-4 py-3 text-sm';
    if (this.disciplinaForm().invalid()) {
      return `${base} border-amber-200 bg-amber-50 text-amber-800`;
    }
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-800`;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['editingDisciplina']) {
      return;
    }

    if (this.editingDisciplina) {
      this.isEditing.set(true);
      this.disciplinaModel.set({
        disciplina: this.editingDisciplina.disciplina,
        segundo_semestre: this.editingDisciplina.segundo_semestre,
        carga_horaria: this.editingDisciplina.carga_horaria,
        situacao: this.editingDisciplina.situacao,
      });
    } else {
      this.isEditing.set(false);
    }
  }

  saveDisciplina(): void {
    this.save.emit(this.disciplinaModel());
    this.disciplinaModel.set(this.emptyForm());
  }

  cancelEdit(): void {
    this.disciplinaModel.set(this.emptyForm());
    this.cancel.emit();
  }

  private emptyForm(): DisciplinaForm {
    return {
      disciplina: '',
      segundo_semestre: false,
      carga_horaria: null,
      situacao: 'Cursando',
    };
  }
}
