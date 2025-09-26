import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoListItem } from '../interfaces/todo-list.interface';
import { TODO_API_URL } from '../config/injection-tokens/domain.injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  constructor(
    private http: HttpClient,
    @Inject(TODO_API_URL) private readonly baseUrl: string
  ) {}

  getTodos(): Observable<TodoListItem[]> {
    return this.http.get<TodoListItem[]>(`${this.baseUrl}/todos`);
  }

  addTodo(todo: TodoListItem): Observable<TodoListItem> {
    return this.http.post<TodoListItem>(`${this.baseUrl}/todos`, todo);
  }

  updateTodo(id: number | string, todo: TodoListItem): Observable<TodoListItem> {
    return this.http.put<TodoListItem>(`${this.baseUrl}/todos/${Number(id)}`, todo);
  }

  patchTodo(id: number | string, changes: Partial<TodoListItem>): Observable<TodoListItem> {
    return this.http.patch<TodoListItem>(`${this.baseUrl}/todos/${Number(id)}`, changes);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${Number(id)}`);
  }
}