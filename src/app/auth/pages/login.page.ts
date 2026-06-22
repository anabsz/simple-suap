import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginSubmit } from '../auth.model';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-emerald-50">
      <form
        class="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-8 shadow"
        (ngSubmit)="onSubmit()"
      >
        <h1 class="text-2xl font-semibold text-slate-900">Entrar</h1>

        <label class="flex flex-col gap-1 text-sm text-slate-600">
          Usuário
          <input
            class="rounded border border-slate-300 px-3 py-2"
            name="username"
            [(ngModel)]="username"
            required
          />
        </label>

        <label class="flex flex-col gap-1 text-sm text-slate-600">
          Senha
          <input
            class="rounded border border-slate-300 px-3 py-2"
            name="password"
            type="password"
            [(ngModel)]="password"
            required
          />
        </label>

        @if (errorMessage()) {
          <p class="text-sm text-red-600">{{ errorMessage() }}</p>
        }
        <button
          type="submit"
          class="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="isLoading()"
        >
          Entrar
        </button>
      </form>
    </div>
  `,
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  readonly errorMessage = signal<string | null>(null);

  readonly isLoading = signal<boolean>(false); 

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    const payload: LoginSubmit = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.authService.loadCurrentUser().subscribe({
          next: () => this.router.navigate(['/disciplinas']),
          error: () => this.router.navigate(['/disciplinas']),
        });
      },
      error: () => {
        this.errorMessage.set('Usuário ou senha inválidos.')
        this.isLoading.set(false);
      },
    });
  }
}