import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Subscription } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login with credentials and set isLoading', () => {
    

    authServiceSpy.login.and.returnValue(of({}));
    
    component.credentials = { email: 'a@b.com', password: '123' };
    component.isLoading = false;

    expect(component.isLoading).toBeFalse();
  });

  it('should set error on login error and reset isLoading', () => {
    const errorResponse = { message: 'Invalid credentials' };

    authServiceSpy.login.and.returnValue(
      throwError(() => errorResponse)
    );

    component.credentials = { email: 'a@b.com', password: '123' };
    component.isLoading = true;
    component.error = '';

    spyOn(console, 'error');

    component.onSubmit();

    expect(component.error).toBe('Invalid credentials');
  });
});