import { Component } from '@angular/core';
import { DisciplinaPage } from './disciplina/disciplina.page';

@Component({
  selector: 'app-root',
  imports: [DisciplinaPage],
  template: `
    <app-disciplina-page />
  `
})
export class App {
}
