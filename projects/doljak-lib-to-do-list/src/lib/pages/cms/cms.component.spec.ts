import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsComponent } from './cms.component';
import { CmsService } from '../../services/cms.service';
import { LOCAL_VARS } from '../../config/local/consts';
import { User } from 'doljak-lib-to-do-list';
import { of } from 'rxjs';

describe('CmsComponent', () => {
  let component: CmsComponent;
  let fixture: ComponentFixture<CmsComponent>;
  let cmsServiceMock: jasmine.SpyObj<CmsService>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    profile: 'admin'
  };

  const mockUsers = [mockUser];

  beforeEach(async () => {
    cmsServiceMock = jasmine.createSpyObj('CmsService', ['getUsers']);
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem']);
    
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });
    
    await TestBed.configureTestingModule({
      imports: [CmsComponent],
      providers: [
        { provide: CmsService, useValue: cmsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CmsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAdminUser', () => {
    it('should return null when not localhost', () => {
      spyOnProperty(LOCAL_VARS, 'isLocalhost', 'get').and.returnValue(false);
      expect(component.getAdminUser()).toBeNull();
    });

    it('should return user from localStorage when localhost', () => {
      spyOnProperty(LOCAL_VARS, 'isLocalhost', 'get').and.returnValue(true);
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockUser));
      
      expect(component.getAdminUser()).toEqual(mockUser);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(LOCAL_VARS.STORAGE_KEY);
    });

    it('should return null when localStorage is empty', () => {
      spyOnProperty(LOCAL_VARS, 'isLocalhost', 'get').and.returnValue(true);
      localStorageSpy.getItem.and.returnValue(null);
      
      expect(component.getAdminUser()).toBeNull();
    });
  });

  describe('loadUsers', () => {
    it('should load users on init', () => {
      cmsServiceMock.getUsers.and.returnValue(of(mockUsers));
      
      component.ngOnInit();
      
      expect(cmsServiceMock.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
    });
  });

  describe('CRUD operations', () => {
    beforeEach(() => {
      spyOn(console, 'log');
    });

    it('should log add user action', () => {
      component.addUser();
      expect(console.log).toHaveBeenCalledWith('Add user clicked');
    });

    it('should log edit user action', () => {
      component.editUser(mockUser);
      expect(console.log).toHaveBeenCalledWith('Edit user:', mockUser);
    });

    it('should log delete user action', () => {
      const userId = '1';
      component.deleteUser(userId);
      expect(console.log).toHaveBeenCalledWith('Delete user:', userId);
    });
  });

  describe('Initial state', () => {
    it('should initialize users as empty array', () => {
      expect(component.users).toEqual([]);
    });

    it('should set currentUser from getAdminUser', () => {
      spyOn(component, 'getAdminUser').and.returnValue(mockUser);
      component = fixture.componentInstance;
      expect(component.currentUser).toEqual(mockUser);
    });
  });
});