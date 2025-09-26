export interface LoginStatus {
    isLoggedIn: boolean;
    token?: string;
    error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}