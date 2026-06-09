import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Disciplina, Situacao } from '../../disciplina.model';

@Component({
  selector: 'app-disciplina-table',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './table.html',
})
export class DisciplinaTableComponent {
  disciplinas = input<Disciplina[]>([]);

  edit = output<number>();
  remove = output<number>();
  notasChange = output<Disciplina>();

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
}
