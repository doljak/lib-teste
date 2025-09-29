export interface LibEnvironment {
  apiBaseUrl?: string;
  endpoints?: LibEndpoints;
}

export interface LibEndpoints {
  getUsers?: string;
  getUser?: string;
  login?: string;
  getTodos?: string;
  configmap?: string;
}