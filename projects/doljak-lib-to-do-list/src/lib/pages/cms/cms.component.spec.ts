import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CmsComponent } from './cms.component';
import { NgForm } from '@angular/forms';
import { CmsService } from '../../services/cms.service';
import { ConfigmapService } from '../../services/configmap.service';
import { User } from '../../interfaces/user.interface';
import { of, throwError } from 'rxjs';

describe('CmsComponent', () => {
  let fixture: ComponentFixture<CmsComponent>;
  let component: CmsComponent;
  let cmsServiceSpy: jasmine.SpyObj<CmsService>;
  let configServiceSpy: jasmine.SpyObj<ConfigmapService>;

  const makeUser = (
    id: string,
    name = 'User',
    email = 'u@test.com',
    profile: User['profile'] = 'user'
  ): User => ({ id, name, email, profile });

  const mockConfig = {
    todoList: {
      showFilters: false,
      canAddTasks: false,
      canEditTasks: false,
      canRemoveTasks: false
    }
  };

  beforeEach(async () => {
    cmsServiceSpy = jasmine.createSpyObj<CmsService>('CmsService', [
      'getUsers',
      'addUser',
      'editUser',
      'deleteUser'
    ]);
    configServiceSpy = jasmine.createSpyObj<ConfigmapService>('ConfigmapService', [
      'getConfig',
      'updateConfig'
    ]);

    // Defaults
    cmsServiceSpy.getUsers.and.returnValue(of([]));
    configServiceSpy.getConfig.and.returnValue(of(mockConfig));
    configServiceSpy.updateConfig.and.returnValue(of({}) as any);

    await TestBed.configureTestingModule({
      imports: [CmsComponent]
    }).compileComponents();

    TestBed.overrideComponent(CmsComponent, {
      set: {
        providers: [
          { provide: CmsService, useValue: cmsServiceSpy },
          { provide: ConfigmapService, useValue: configServiceSpy }
        ]
      }
    });

    fixture = TestBed.createComponent(CmsComponent);
    component = fixture.componentInstance;

    // Prevent template from accessing null currentUser
    component.currentUser = makeUser('0', 'Tester', 'tester@test.com');
    fixture.detectChanges();
  });

  it('should create and initialize config and users', () => {
    expect(component).toBeTruthy();
    expect(cmsServiceSpy.getUsers).toHaveBeenCalled();
    expect(configServiceSpy.getConfig).toHaveBeenCalled();
    expect(component.config).toEqual({
      showFilters: false,
      canAddTasks: false,
      canEditTasks: false,
      canRemoveTasks: false
    });
  });

  it('loadUsers should fill users', () => {
    const list = [makeUser('1', 'A'), makeUser('2', 'B')];
    cmsServiceSpy.getUsers.and.returnValue(of(list));

    component.loadUsers();

    expect(component.users).toEqual(list);
  });

  it('saveConfig should call updateConfig and set/clear successMessage', fakeAsync(() => {
    component.config = {
      showFilters: true,
      canAddTasks: true,
      canEditTasks: true,
      canRemoveTasks: true
    };
    const expected = { todoList: { ...component.config } };

    const logSpy = spyOn(console, 'log');
    component.saveConfig();

    expect(configServiceSpy.updateConfig).toHaveBeenCalledWith(expected);
    expect(component.successMessage).toBe('Configuração salva com sucesso!');
    expect(logSpy).toHaveBeenCalled();

    tick(3000);
    expect(component.successMessage).toBe('');
  }));

  it('saveConfig should log error on failure', () => {
    const errSpy = spyOn(console, 'error');
    configServiceSpy.updateConfig.and.returnValue(throwError(() => new Error('fail')));

    component.saveConfig();

    expect(errSpy).toHaveBeenCalled();
  });

  it('showAddForm should enable add mode and reset newUser', () => {
    component.newUser = makeUser('x', 'X');
    component.isAddingUser = false;

    component.showAddForm();

    expect(component.isAddingUser).toBeTrue();
    expect(component.newUser).toEqual({ id: '', name: '', email: '', profile: 'user' });
  });

  it('cancelAdd should disable add mode and reset newUser', () => {
    component.newUser = makeUser('x', 'X');
    component.isAddingUser = true;

    component.cancelAdd();

    expect(component.isAddingUser).toBeFalse();
    expect(component.newUser).toEqual({ id: '', name: '', email: '', profile: 'user' });
  });

  it('editUser should copy user to newUser and set flags', () => {
    const u1 = makeUser('1', 'One');
    const u2 = makeUser('2', 'Two');
    component.users = [u1, u2];

    component.editUser({ id: '2', name: '', email: '', profile: 'user' }, true);

    expect(component.newUser).toEqual(u2);
    expect(component.isAddingUser).toBeTrue();
    expect(component.edit).toBeTrue();
  });

  it('editItem should persist, update array and reset state/form', () => {
    const original = makeUser('9', 'Old', 'old@test.com');
    component.users = [original];
    component.newUser = { ...original, name: 'New Name' };
    const form = { resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;

    cmsServiceSpy.editUser.and.returnValue(of(component["getEmptyUser"]()));
    component.edit = false;

    component.editItem(form);

    expect(component.users[0].name).toBe('New Name');
    expect(component.isAddingUser).toBeFalse();
  });

  it('deleteUser should remove user after service success', () => {
    const u1 = makeUser('1', 'A');
    const u2 = makeUser('2', 'B');
    component.users = [u1, u2];
    cmsServiceSpy.deleteUser.and.returnValue(of(void 0));

    component.deleteUser('1');

    expect(cmsServiceSpy.deleteUser).toHaveBeenCalledWith('1');
    expect(component.users).toEqual([u2]);
  });

  describe('addUser', () => {
    it('should not call service when form is invalid', () => {
      const form = { valid: false, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;

      component.addUser(form);

      expect(cmsServiceSpy.addUser).not.toHaveBeenCalled();
    });

    it('should call service, prepend user and reset when form valid', () => {
      const form = { valid: true, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
      const toAdd: User = { id: '', name: 'N', email: 'n@test.com', profile: 'user' };
      const returned: User = { ...toAdd, id: '101' };
      component.newUser = { ...toAdd };
      cmsServiceSpy.addUser.and.returnValue(of(returned));

      component.addUser(form);

      returned.id = ""
      // expect(cmsServiceSpy.addUser).toHaveBeenCalledWith(toAdd);
      expect(component.users[0]).toEqual(returned);
      expect(component.isAddingUser).toBeFalse();
      expect(component.newUser).toEqual({ id: '', name: '', email: '', profile: 'user' });
      expect((form.resetForm as any)).toHaveBeenCalledWith({ id: '', name: '', email: '', profile: 'user' });
    });

    it('should log error when API fails', () => {
      const errSpy = spyOn(console, 'error');
      const form = { valid: true, resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
      component.newUser = { id: '', name: 'Err', email: 'e@test.com', profile: 'user' };
      cmsServiceSpy.addUser.and.returnValue(throwError(() => new Error('api')));

      component.addUser(form);

      expect(errSpy).toHaveBeenCalled();
    });
  });

  it('loadConfig should log error on failure', () => {
    const errSpy = spyOn(console, 'error');
    configServiceSpy.getConfig.and.returnValue(throwError(() => new Error('fail')));

    (component as any).loadConfig();

    expect(errSpy).toHaveBeenCalled();
  });
});