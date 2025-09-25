export interface Users{
  users: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile: 'admin' | 'user';
}