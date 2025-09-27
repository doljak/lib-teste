import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CMS_API_URL } from '../config/injection-tokens/domain.injection.tokens';
import { ENDPOINTS, LIB_ENV } from '../../public-api';
import { LibEnvironment } from '../interfaces/lib.enviroment.interface';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  constructor(
    private http: HttpClient,
    @Inject(LIB_ENV) private readonly libEnv: LibEnvironment,
    @Inject(CMS_API_URL) private readonly baseUrl: string
  ) {}

  getUsers(): Observable<any[]> {
    const usersEndpoint = this.libEnv.endpoints?.getUsers || ENDPOINTS.getUsers;
    return this.http.get<any[]>(`${this.baseUrl}${usersEndpoint}`);
  }

  addUser(user: any): Observable<any> {
    const usersEndpoint = this.libEnv.endpoints?.getUsers || ENDPOINTS.getUsers;
    return this.http.post<any>(`${this.baseUrl}${usersEndpoint}`, user);
  }

  editUser(id: string, user: any): Observable<any> {
    const usersEndpoint = this.libEnv.endpoints?.getUsers || ENDPOINTS.getUsers;
    return this.http.put<any>(`${this.baseUrl}${usersEndpoint}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    const usersEndpoint = this.libEnv.endpoints?.getUsers || ENDPOINTS.getUsers;
    return this.http.delete<void>(`${this.baseUrl}${usersEndpoint}/${id}`);
  }
}