import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoList, TodoListItem } from '../interfaces/todo-list.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTodos(): Observable<TodoListItem[]> {
    return this.http.get<TodoListItem[]>(`${this.apiUrl}/todos`);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${Number(id)}`);
  }

  updateTodo(id: number, todo: TodoListItem): Observable<TodoListItem> {
    console.log('Updating todo with ID:', id, 'Data:', todo);
    return this.http.put<TodoListItem>(`${this.apiUrl}/todos/${Number(id)}`, todo);
  }

  addTodo(todo: TodoListItem): Observable<TodoListItem> {
    return this.http.post<TodoListItem>(`${this.apiUrl}/todos`, todo);
  }
  
}