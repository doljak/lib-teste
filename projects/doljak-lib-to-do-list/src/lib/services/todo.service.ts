import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoListItem } from '../interfaces/todo-list.interface';
import { TODO_API_URL } from '../config/injection-tokens/domain.injection.tokens';
import { ENDPOINTS, LIB_ENV } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  constructor(
    private http: HttpClient,
    @Inject(LIB_ENV) private readonly libEnv: any,
    @Inject(TODO_API_URL) private readonly baseUrl: string
  ) {}

  getTodos(): Observable<TodoListItem[]> {
    const todosEndpoint = this.libEnv.endpoints?.getTodos || ENDPOINTS.getTodos;
    return this.http.get<TodoListItem[]>(`${this.baseUrl}${todosEndpoint}`);
  }

  addTodo(todo: TodoListItem): Observable<TodoListItem> {
    const todosEndpoint = this.libEnv.endpoints?.getTodos || ENDPOINTS.getTodos;
    return this.http.post<TodoListItem>(`${this.baseUrl}${todosEndpoint}`, todo);
  }

  updateTodo(id: number | string, todo: TodoListItem): Observable<TodoListItem> {
    const todosEndpoint = this.libEnv.endpoints?.getTodos || ENDPOINTS.getTodos;
    return this.http.put<TodoListItem>(`${this.baseUrl}${todosEndpoint}/${Number(id)}`, todo);
  }

  patchTodo(id: number | string, changes: Partial<TodoListItem>): Observable<TodoListItem> {
    const todosEndpoint = this.libEnv.endpoints?.getTodos || ENDPOINTS.getTodos;
    return this.http.patch<TodoListItem>(`${this.baseUrl}${todosEndpoint}/${Number(id)}`, changes);
  }

  deleteTodo(id: number): Observable<void> {
    const todosEndpoint = this.libEnv.endpoints?.getTodos || ENDPOINTS.getTodos;
    return this.http.delete<void>(`${this.baseUrl}${todosEndpoint}/${Number(id)}`);
  }
}