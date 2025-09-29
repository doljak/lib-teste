import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoListService } from './todo.service';
import { TodoListItem } from '../interfaces/todo-list.interface';

describe('TodoListService', () => {
  let service: TodoListService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000';
  const todosEndpoint = '/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoListService]
    });
    service = TestBed.inject(TodoListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos', () => {
    const mockTodos: TodoListItem[] = [
      { id: 1, title: 'Test Todo', completed: false } as any
    ];

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should add todo', () => {
    const mockTodo: TodoListItem = { id: "2", title: 'New Todo', completed: false } as any;

    service.addTodo(mockTodo).subscribe(response => {
      expect(response).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTodo);
    req.flush(mockTodo);
  });

  it('should update todo', () => {
    const mockTodo: TodoListItem = { id: "3", title: 'Updated Todo', completed: true } as any;
    const todoId = 3;

    service.updateTodo(todoId, mockTodo).subscribe(response => {
      expect(response).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/${todoId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTodo);
    req.flush(mockTodo);
  });

  it('should patch todo', () => {
    const changes = { completed: true } as Partial<TodoListItem>;
    const todoId = 4;
    const patchedTodo: TodoListItem = { id: "4", title: 'Patched Todo', completed: true } as any;

    service.patchTodo(todoId, changes).subscribe(response => {
      expect(response).toEqual(patchedTodo);
    });

    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/${todoId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(changes);
    req.flush(patchedTodo);
  });

  it('should delete todo', () => {
    const todoId = 5;

    service.deleteTodo(todoId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error on getTodos', () => {
    service.getTodos().subscribe({
      error: err => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Server Error');
      }
    });
    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error on addTodo', () => {
    const mockTodo: TodoListItem = { id: "6", title: 'Error Todo', completed: false } as any;
    service.addTodo(mockTodo).subscribe({
      error: err => {
        expect(err.status).toBe(400);
        expect(err.statusText).toBe('Bad Request');
      }
    });
    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}`);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle error on updateTodo', () => {
    const mockTodo: TodoListItem = { id: "7", title: 'Error Update', completed: false } as any;
    service.updateTodo(7, mockTodo).subscribe({
      error: err => {
        expect(err.status).toBe(404);
        expect(err.statusText).toBe('Not Found');
      }
    });
    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/7`);
    req.flush('Error', { status: 404, statusText: 'Not Found' });
  });

  it('should handle error on patchTodo', () => {
    service.patchTodo(8, { completed: true } as Partial<TodoListItem>).subscribe({
      error: err => {
        expect(err.status).toBe(403);
        expect(err.statusText).toBe('Forbidden');
      }
    });
    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/8`);
    req.flush('Error', { status: 403, statusText: 'Forbidden' });
  });

  it('should handle error on deleteTodo', () => {
    service.deleteTodo(9).subscribe({
      error: err => {
        expect(err.status).toBe(401);
        expect(err.statusText).toBe('Unauthorized');
      }
    });
    const req = httpMock.expectOne(`${baseUrl}${todosEndpoint}/9`);
    req.flush('Error', { status: 401, statusText: 'Unauthorized' });
  });
});