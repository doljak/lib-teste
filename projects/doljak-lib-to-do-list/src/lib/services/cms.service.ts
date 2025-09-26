import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CMS_API_URL } from '../config/injection-tokens/domain.injection.tokens';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  constructor(
    private http: HttpClient,
    @Inject(CMS_API_URL) private readonly baseUrl: string
  ) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users`, user);
  }

  editUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}