import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
;
import { finalize } from 'rxjs/operators';
import { AuthService, LoginCredentials } from '../../services/AuthService';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };
  
  error = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.error = '';
    this.isLoading = true;
    
    this.authService.login(this.credentials).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      error: ((err: any) => {
        console.error('Login error', err);
        this.error = 'Invalid credentials';
      })
    });
  }
}