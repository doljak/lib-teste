import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoListService } from '../../services/todo.service';
import { ConfigmapService } from '../../services/configmap.service';
import { of, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { TodoListItem } from '../../interfaces/todo-list.interface';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoListService>;
  let configmapServiceSpy: jasmine.SpyObj<ConfigmapService>;

  const mockTodos: TodoListItem[] = [
    { id: "1", compromisse: 'A', done: false, description: 'descA' },
    { id: "2", compromisse: 'B', done: true, description: 'descB' }
  ];

  beforeEach(async () => {
    todoServiceSpy = jasmine.createSpyObj('TodoListService', [
      'getTodos', 'addTodo', 'updateTodo', 'deleteTodo'
    ]);
    configmapServiceSpy = jasmine.createSpyObj('ConfigmapService', ['getConfig']);

    todoServiceSpy.getTodos.and.returnValue(of(mockTodos));
    configmapServiceSpy.getConfig.and.returnValue(of({
      todoList: {
        showFilters: true,
        canAddTasks: true,
        canEditTasks: true,
        canRemoveTasks: true
      }
    }));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent]
    })
    .overrideComponent(TodoListComponent, {
      set: {
        providers: [
          { provide: TodoListService, useValue: todoServiceSpy },
          { provide: ConfigmapService, useValue: configmapServiceSpy }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos and config on init', () => {
    expect(todoServiceSpy.getTodos).toHaveBeenCalled();
    expect(configmapServiceSpy.getConfig).toHaveBeenCalled();
    expect(component.configMap.todoList.showFilters).toBeTrue();
  });

  it('should filter todos by completed', () => {
    component.todos = mockTodos;
    component.filterTodos('completed');
    expect(component.filteredTodos[0].done).toBeTrue();
  });

  it('should filter todos by pending', () => {
    component.todos = mockTodos;
    component.filterTodos('pending');
    expect(component.filteredTodos[0].done).toBeFalse();
  });

  it('should filter todos by all', () => {
    component.todos = mockTodos;
    component.filterTodos('all');
    expect(component.filteredTodos.length).toBe(3);
  });

  it('should show add form and reset newTodo', () => {
    component.newTodo = { compromisse: 'X', done: true, description: 'Y' };
    component.isAddingTodo = false;
    component.showAddForm();
    expect(component.isAddingTodo).toBeTrue();
    expect(component.newTodo).toEqual({ compromisse: '', done: false, description: '' });
  });

  it('should cancel add and reset newTodo', () => {
    component.newTodo = { compromisse: 'X', done: true, description: 'Y' };
    component.isAddingTodo = true;
    component.cancelAdd();
    expect(component.isAddingTodo).toBeFalse();
    expect(component.newTodo).toEqual({ compromisse: '', done: false, description: '' });
  });

  it('should call deleteTodo and update todos', fakeAsync(() => {
    component.todos = [...mockTodos];
    todoServiceSpy.deleteTodo.and.returnValue(of(void 0));
    component.deleteTodo('1');
    tick();
    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
  }));

  it('should call editTodo and set edit state', () => {
    component.todos = [...mockTodos];
    component.editTodo('2', true);
    expect(component.isAddingTodo).toBeTrue();
    expect(component.edit).toBeTrue();
  });

  it('should call editItem and update todo', fakeAsync(() => {
    const form = { resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
    component.todos = [...mockTodos];
    component.newTodo = { ...mockTodos[0], compromisse: 'Edited', description: 'Edited desc' };
    todoServiceSpy.updateTodo.and.returnValue(of({ ...component.newTodo } as TodoListItem));

    component.editItem(form);
    tick();

    expect(component.todos[0].compromisse).toBe('Edited');
    expect(component.isAddingTodo).toBeFalse();
    expect(component.edit).toBeFalse();
    expect(form.resetForm).toHaveBeenCalledWith({ compromisse: '', done: false, description: '' });
  }));

  it('should toggle todo done state', fakeAsync(() => {
    component.todos = [...mockTodos];
    todoServiceSpy.updateTodo.and.returnValue(of({ ...mockTodos[0], done: true }));

    component.toggleTodo('1');
    tick();

    expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith(1, jasmine.objectContaining({ done: true }));
  }));

  it('should add todo when form is valid', fakeAsync(() => {
    const form = { valid: true, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
    const newTodo: TodoListItem = { id: "99", compromisse: 'New', done: false, description: 'desc' };
    component.newTodo = { compromisse: 'New', done: false, description: 'desc' };
    todoServiceSpy.addTodo.and.returnValue(of(newTodo));

    component.addTodo(form);
    tick();

    expect(todoServiceSpy.addTodo).toHaveBeenCalledWith(jasmine.objectContaining({ compromisse: 'New' }));
    expect(component.todos[0]).toEqual(newTodo);
    expect(component.isAddingTodo).toBeFalse();
    expect(form.resetForm).toHaveBeenCalledWith({ compromisse: '', done: false, description: '' });
  }));

  it('should not add todo when form is invalid', () => {
    const form = { valid: false, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
    todoServiceSpy.addTodo.calls.reset();
    component.addTodo(form);
    expect(todoServiceSpy.addTodo).not.toHaveBeenCalled();
  });

  it('should handle error on addTodo', fakeAsync(() => {
    const form = { valid: true, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
    todoServiceSpy.addTodo.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');
    component.newTodo = { compromisse: 'Err', done: false, description: 'desc' };

    component.addTodo(form);
    tick();

    expect(console.error).toHaveBeenCalledWith('Erro ao adicionar todo:', jasmine.any(Error));
  }));

});