import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Disciplina } from '../../disciplina.model';


@Component({
  selector: 'app-disciplina-detail',
  imports: [CardModule],
  template: `
    <p-card>
    <div class="flex flex-col gap-6">

        <div>
        <h2 class="text-2xl font-semibold text-slate-900">
            {{ disciplina().disciplina }}
        </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2">

        <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-xs uppercase text-slate-500">
            Situação
            </p>

            <p class="mt-1 text-lg font-medium">
            {{ disciplina().situacao }}
            </p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-xs uppercase text-slate-500">
            Carga Horária
            </p>

            <p class="mt-1 text-lg font-medium">
            {{ disciplina().carga_horaria }}h
            </p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-xs uppercase text-slate-500">
            Média
            </p>

            <p class="mt-1 text-lg font-medium">
            {{ disciplina().media_disciplina ?? '-' }}
            </p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-xs uppercase text-slate-500">
            Faltas
            </p>

            <p class="mt-1 text-lg font-medium">
            {{ totalFaltas() }}
            </p>
        </div>

        </div>

        <div>
        <h3 class="mb-3 text-lg font-semibold">
            Etapas
        </h3>

        <div class="grid gap-3 md:grid-cols-2">

            <div class="rounded-xl border border-slate-200 p-4">
            <h4 class="font-medium">1ª Etapa</h4>

            <p>Nota: {{ disciplina().nota_etapa_1.nota ?? '-' }}</p>
            <p>Faltas: {{ disciplina().nota_etapa_1.faltas }}</p>
            </div>

            <div class="rounded-xl border border-slate-200 p-4">
            <h4 class="font-medium">2ª Etapa</h4>

            <p>Nota: {{ disciplina().nota_etapa_2.nota ?? '-' }}</p>
            <p>Faltas: {{ disciplina().nota_etapa_2.faltas }}</p>
            </div>

            <div class="rounded-xl border border-slate-200 p-4">
            <h4 class="font-medium">3ª Etapa</h4>

            <p>Nota: {{ disciplina().nota_etapa_3.nota ?? '-' }}</p>
            <p>Faltas: {{ disciplina().nota_etapa_3.faltas }}</p>
            </div>

            <div class="rounded-xl border border-slate-200 p-4">
            <h4 class="font-medium">4ª Etapa</h4>

            <p>Nota: {{ disciplina().nota_etapa_4.nota ?? '-' }}</p>
            <p>Faltas: {{ disciplina().nota_etapa_4.faltas }}</p>
            </div>

        </div>
        </div>

    </div>
    </p-card>
  `,
})
export class DisciplinaDetailComponent {
  disciplina = input.required<Disciplina>();

  readonly totalFaltas = computed(() => {
    const d = this.disciplina();

    return (
      d.nota_etapa_1.faltas +
      d.nota_etapa_2.faltas +
      d.nota_etapa_3.faltas +
      d.nota_etapa_4.faltas
    );
  });
}