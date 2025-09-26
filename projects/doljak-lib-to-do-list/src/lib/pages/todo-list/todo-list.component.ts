import { Component, inject, OnInit } from '@angular/core';
import { TodoListService } from '../../services/todo.service';
import { take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { TodoList, TodoListItem } from '../../interfaces/todo-list.interface';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'lib-todo-list',
  standalone: true,
  imports: [HttpClientModule, DatePipe, NgFor, NgIf],
  providers: [TodoListService],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoListService = inject(TodoListService);

  todos: TodoListItem[] = [];
  filteredTodos: TodoListItem[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.todoListService
      .getTodos()
      .pipe(take(1))
      .subscribe(todoList => {
        this.todos = todoList;
        this.filterTodos(this.filter);
      });
  }
  
  filterTodos(status: 'all' | 'completed' | 'pending'): void {
    this.filter = status;
    
    switch (status) {
      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.done);
        break;
      case 'pending':
        this.filteredTodos = this.todos.filter(todo => !todo.done);
        break;
      default:
        this.filteredTodos = [...this.todos];
    }
  }

  deleteTodo(id: number): void {
    this.todoListService.deleteTodo(id)
      .pipe(take(1))
      .subscribe(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.filterTodos(this.filter);
      });
  }

  editTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      // Here you would typically open a modal or navigate to edit form
      console.log('Edit todo:', todo);
    }
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      this.todoListService.updateTodo(id, updatedTodo)
        .pipe(take(1))
        .subscribe(() => {
          todo.done = !todo.done;
          this.filterTodos(this.filter);
        });
    }
  }
}