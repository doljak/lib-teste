import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TodoListItem } from '../../interfaces/todo-list.interface';
import { TodoListService } from '../../services/todo.service';
import { take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { DEV_ENV } from '../../config/injection-tokens/api.base.injection.token';


@Component({
  selector: 'lib-todo-list',
  standalone: true,
  imports: [HttpClientModule, DatePipe, NgFor, NgIf, HeaderComponent, FormsModule],
  providers: [TodoListService],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoListService = inject(TodoListService);

  todos: TodoListItem[] = [];
  filteredTodos: TodoListItem[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';
  isAddingTodo:boolean = false
  newTodo: Partial<TodoListItem> = this.getEmptyTodo();
  edit: boolean = false;
  btnText: string = this.edit ? 'Salvar Edição' : 'Adicionar';

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

  deleteTodo(id: string): void {
    this.todoListService.deleteTodo(Number(id))
      .pipe(take(1))
      .subscribe(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.filterTodos(this.filter);
      });
  }

  editTodo(id: string, edit: boolean): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      this.newTodo = { ...todo };
      this.isAddingTodo = true;
      this.edit = true;
    }
  }

  editItem(form: NgForm): void {
    console.log('Editando item:', this.newTodo);
    this.todoListService.updateTodo(Number(this.newTodo.id), this.newTodo as TodoListItem)
    .pipe(take(1))
        .subscribe(() => {
          this.todos = this.todos.map(todo =>
            todo.id === this.newTodo.id ? { ...todo, ...this.newTodo } : todo
          );

          this.filterTodos(this.filter);
          this.isAddingTodo = false
          this.edit = false;
          this.newTodo = this.getEmptyTodo();
          form.resetForm(this.getEmptyTodo());
        });
  }

  toggleTodo(id: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      this.todoListService.updateTodo(Number(id), updatedTodo)
        .pipe(take(1))
        .subscribe(() => {
          todo.done = !todo.done;
          this.filterTodos(this.filter);
        });
    }
  }

  private getEmptyTodo(): Partial<TodoListItem> {
    return {
      compromisse: '',
      done: false,
      description: ''
    };
  }

  showAddForm(): void {
    this.isAddingTodo = true;
    this.newTodo = this.getEmptyTodo();
  }

  cancelAdd(): void {
    this.isAddingTodo = false;
    this.newTodo = this.getEmptyTodo();
  }

  addTodo(form: NgForm): void {
    if (!form.valid) return; 

    if (DEV_ENV.isLocalhost && !this.edit) {
      this.newTodo.id = String(Math.floor(Math.random() * 10000));
    }

    this.todoListService.addTodo(this.newTodo as TodoListItem)
      .pipe(take(1))
      .subscribe({
        next: (todo: TodoListItem) => {
          this.todos.unshift(todo);
          this.isAddingTodo = false;
          this.newTodo = this.getEmptyTodo();
          form.resetForm(this.getEmptyTodo());
          this.filterTodos(this.filter);
        },
        error: (err: any) => console.error('Erro ao adicionar todo:', err)
      });
  }
}