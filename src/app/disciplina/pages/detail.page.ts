import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { DisciplinaService } from '../disciplina.service';
import { DisciplinaDetailComponent } from '../components/detail/detail';

@Component({
  imports: [DisciplinaDetailComponent, RouterLink],
  template: `
    @if (disciplina(); as disciplina) {
    <div class="min-h-screen w-full bg-emerald-50">
        <div class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10">
        <header class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl font-semibold text-slate-900 md:text-4xl">
                    SUAP Simples
                </h1>
            </div>
            <div class="flex justify-between gap-2">
                <p class="text-lg font-semibold uppercase text-slate-500">
                    Detalhes da Disciplina
                </p>
                <a routerLink="/disciplinas" class="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600">
                    Voltar
                </a>
            </div>
        </header>
        <app-disciplina-detail [disciplina]="disciplina"/>
        </div>
    </div>
    } @else {
    <div class="min-h-screen w-full bg-emerald-50">
        <div class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10">
        <header class="flex flex-col gap-3">
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl font-semibold text-slate-900 md:text-4xl">
                    SUAP Simples
                </h1>
                <p>Disciplina não encontrada.</p>
            </div>
        </header>
        </div>
    </div>
    }
  `,
})
export class DisciplinaDetailPage {
  private route = inject(ActivatedRoute);
  private service = inject(DisciplinaService);

  readonly disciplina = computed(() => {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    return this.service.findById(id);
  });
}