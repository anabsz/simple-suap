import { Routes } from '@angular/router';
import { DisciplinaTablePage } from './disciplina/pages/table.page';
import { DisciplinaCreatePage } from './disciplina/pages/create.page';
import { DisciplinaEditPage } from './disciplina/pages/update.page';
import { DisciplinaDetailPage } from './disciplina/pages/detail.page';
import { LoginPage } from './auth/pages/login.page';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/disciplinas',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'disciplinas',
    canActivate: [authGuard],
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
        path: ':id',
        component: DisciplinaDetailPage,
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