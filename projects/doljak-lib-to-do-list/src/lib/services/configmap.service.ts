import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIGMAP_API_URL, ENDPOINTS, LIB_ENV } from '../../public-api';
import { ConfigMap } from '../interfaces/configmap.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigmapService {
  constructor(
    private http: HttpClient,
    @Inject(LIB_ENV) private readonly libEnv: any,
    @Inject(CONFIGMAP_API_URL) private readonly baseUrl: string
  ) {}

  getConfig(): Observable<ConfigMap> {
    const configmap = this.libEnv.endpoints?.configmap || ENDPOINTS.configmap;
    return this.http.get<ConfigMap>(`${this.baseUrl}${configmap}`);
  }

  updateConfig(config: ConfigMap): Observable<ConfigMap> {
    const configmap = this.libEnv.endpoints?.configmap || ENDPOINTS.configmap;
    return this.http.put<ConfigMap>(`${this.baseUrl}${configmap}`, config);
  }
}