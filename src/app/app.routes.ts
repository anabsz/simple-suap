import { Routes } from '@angular/router';
import { DisciplinaTablePage } from './disciplina/pages/table.page';
import { DisciplinaCreatePage } from './disciplina/pages/create.page';
import { DisciplinaEditPage } from './disciplina/pages/update.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/disciplinas',
    pathMatch: 'full',
  },
  {
    path: 'disciplinas',
    children: [
      {
        path: '',
        component: DisciplinaTablePage,
      },
      {
        path: 'cadastrar',
        component: DisciplinaCreatePage,
      },
      {
        path: ':id/editar',
        component: DisciplinaEditPage,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/disciplinas',
  }
];