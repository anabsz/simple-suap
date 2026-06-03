import { Component, computed, inject, signal } from '@angular/core';

import { DisciplinaService } from './disciplina.service';
import { Disciplina, DisciplinaForm } from './disciplina.model';
import { DisciplinaFormComponent } from './form/form';
import { DisciplinaTableComponent } from './table/table';

@Component({
  selector: 'app-disciplina-page',
  imports: [
    DisciplinaTableComponent,
    DisciplinaFormComponent,
  ],
  template: `
  <div class="min-h-screen w-full bg-emerald-50">
    <div class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10">
      <header class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold text-slate-900 md:text-4xl">
          SUAP Simples
          </h1>
        </div>

        <p class="text-lg font-semibold uppercase text-slate-500">
          Simular semestre
        </p>
      </header>

      <section class="flex flex-col gap-8">
      <app-disciplina-table
        [disciplinas]="disciplinas()"
        (edit)="startEdit($event)"
        (remove)="delete($event)"
        (notasChange)="updateNotas($event)"
      />

      <app-disciplina-form
        [editingDisciplina]="editingDisciplina()"
        (save)="save($event)"
        (cancel)="cancelEdit()"
      />
        </section>
    </div>
  </div>
  `,
})
export class DisciplinaPage {
  private readonly disciplinaService = inject(DisciplinaService);
  readonly disciplinas = this.disciplinaService.disciplinas;
  readonly editingId = signal<string | null>(null);

  readonly editingDisciplina = computed(() => {
    const id = this.editingId();
    if (!id) {return null;}
    return (
      this.disciplinas().find((disciplina) => disciplina.id === id,) ?? null
    );
  });

  save(payload: DisciplinaForm): void {
    const editingId = this.editingId();

    if (editingId) {
      this.disciplinaService.update(editingId, payload);
    } else {
      this.disciplinaService.create(payload);
    }

    this.cancelEdit();
  }

  startEdit(id: string): void {
    this.editingId.set(id);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  delete(id: string): void {
    this.disciplinaService.delete(id);
    if (this.editingId() === id) {this.cancelEdit();}
  }

  updateNotas(disciplina: Disciplina): void {
    this.disciplinaService.updateNotas(
      disciplina.id,
      () => ({
        nota_etapa_1: disciplina.nota_etapa_1,
        nota_etapa_2: disciplina.nota_etapa_2,
        nota_etapa_3: disciplina.nota_etapa_3,
        nota_etapa_4: disciplina.nota_etapa_4,
      }),
    );
  }
}