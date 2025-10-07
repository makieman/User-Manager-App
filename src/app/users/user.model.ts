export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  active: boolean;
  createdAt?: string | Date;
  lastLogin?: string | Date;
}