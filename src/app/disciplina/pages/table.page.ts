import { Component, inject } from "@angular/core";
import { DisciplinaTableComponent } from "../components/table/table";
import { Router, RouterLink } from "@angular/router";
import { DisciplinaService } from "../disciplina.service";
import { Disciplina } from "../disciplina.model";

@Component({
  imports: [
    DisciplinaTableComponent,
    RouterLink,
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
        <div class="flex justify-between gap-2">
          <p class="text-lg font-semibold uppercase text-slate-500">
            Simular semestre
          </p>
          <a class="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            routerLink="/disciplinas/cadastrar">
            Nova disciplina
          </a>
        </div>
      </header>

      <app-disciplina-table
      [disciplinas]="disciplinas()"
      (edit)="edit($event)"
      (remove)="delete($event)"
      (detail)="detail($event)"
      (notasChange)="updateNotas($event)"
      />

    </div>
  </div>
  `,
})
export class DisciplinaTablePage {
  private router = inject(Router);
  private service = inject(DisciplinaService);
  
  disciplinas = this.service.disciplinas;
  
  edit(id: number) {
    this.router.navigate(['/disciplinas', id, 'editar']);
  }
  
  delete(id: number): void {
    this.service.delete(id);
  }
  
  detail(id: number): void {
    this.router.navigate(['/disciplinas', id]);
  }
  
  updateNotas(disciplina: Disciplina): void {
    this.service.updateNotas(
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