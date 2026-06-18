import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../env';
import {
  Disciplina,
  DisciplinaForm,
  NotasUpdate,
} from './disciplina.model';

@Injectable({
  providedIn: 'root',
})
export class DisciplinaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/disciplinas`;
  
  private readonly disciplinasSignal = signal<Disciplina[]>([]);
  readonly disciplinas = computed(() => this.disciplinasSignal());

  /**
   * Carrega a lista de disciplinas da API e popula o signal local.
   * Chame no bootstrap do componente/feature (ex: no construtor ou em
   * um `effect`/`ngOnInit`) para sincronizar o estado inicial.
   */
  load(): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(this.apiUrl).pipe(
      tap((disciplinas) => this.disciplinasSignal.set(disciplinas)),
    );
  }

  create(payload: DisciplinaForm): Observable<Disciplina> {
    const body: DisciplinaForm = {
      ...payload,
      disciplina: payload.disciplina.trim(),
      carga_horaria: payload.carga_horaria ?? 0,
    };

    return this.http.post<Disciplina>(this.apiUrl, body).pipe(
      tap((disciplina) =>
        this.disciplinasSignal.update((items) => [...items, disciplina]),
      ),
    );
  }

  update(id: number, payload: DisciplinaForm): Observable<Disciplina> {
    const body: DisciplinaForm = {
      ...payload,
      disciplina: payload.disciplina.trim(),
      carga_horaria: payload.carga_horaria ?? 0,
    };

    return this.http.put<Disciplina>(`${this.apiUrl}/${id}`, body).pipe(
      tap((disciplinaAtualizada) =>
        this.disciplinasSignal.update((items) =>
          items.map((item) =>
            item.id === id ? disciplinaAtualizada : item,
          ),
        ),
      ),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.disciplinasSignal.update((items) =>
          items.filter((item) => item.id !== id),
        ),
      ),
    );
  }

  findById(id: number): Disciplina | undefined {
    return this.disciplinasSignal().find(
      (disciplina) => disciplina.id === id,
    );
  }

  /**
   * Busca uma disciplina diretamente na API (útil quando ela ainda não
   * está no signal local, ex: acesso direto a uma rota de edição).
   */
  fetchById(id: number): Observable<Disciplina> {
    return this.http.get<Disciplina>(`${this.apiUrl}/${id}`).pipe(
      tap((disciplina) =>
        this.disciplinasSignal.update((items) => {
          const existe = items.some((item) => item.id === id);
          return existe
            ? items.map((item) => (item.id === id ? disciplina : item))
            : [...items, disciplina];
        }),
      ),
    );
  }

  /**
   * Atualiza uma ou mais etapas de nota via PATCH /disciplinas/{id}/notas.
   * `media_disciplina` é recalculada no backend e vem pronta na resposta.
   */
  updateNotas(id: number, payload: NotasUpdate): Observable<Disciplina> {
    return this.http
      .patch<Disciplina>(`${this.apiUrl}/${id}/notas`, payload)
      .pipe(
        tap((disciplinaAtualizada) =>
          this.disciplinasSignal.update((items) =>
            items.map((item) =>
              item.id === id ? disciplinaAtualizada : item,
            ),
          ),
        ),
      );
  }
}