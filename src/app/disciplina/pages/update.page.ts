import { ActivatedRoute, Router } from "@angular/router";
import { DisciplinaService } from "../disciplina.service";
import { Component, computed, inject } from "@angular/core";
import { DisciplinaForm } from "../disciplina.model";
import { DisciplinaFormComponent } from "../components/form/form";

@Component({
  imports: [DisciplinaFormComponent],
  template: `
    <div class="min-h-screen w-full bg-emerald-50">
    <div class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10">
      <header class="flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold text-slate-900 md:text-4xl">
            SUAP Simples
          </h1>
        </div>
        <div class="flex justify-between gap-2">
          <p class="text-lg font-semibold uppercase text-slate-500">
            Simular semestre
          </p>
        </div>
      </header>
        <app-disciplina-form
        [editingDisciplina]="disciplina()"
        (save)="save($event)"
        (cancel)="cancel()"
        />
    </div>
  </div>

  `,
})
export class DisciplinaEditPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(DisciplinaService);

  readonly disciplina = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return null;
    }

    return this.service.findById(id) ?? null;
  });

  save(payload: DisciplinaForm) {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.service.update(id, payload);

    this.router.navigate(['/disciplinas']);
  }

  cancel() {
    this.router.navigate(['/disciplinas']);
  }
}