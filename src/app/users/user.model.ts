export interface User {
  _id?: string; // MongoDB ID
  id?: number;

  firstName: string;
  lastName: string;
  email: string;
  password?: string;               // optional for existing users
  role: 'admin' | 'user' | 'viewer';
  active: boolean;
  phone?: string;                  // optional
  organization?: string;           // optional
  createdAt?: string | Date;
  lastLogin?: string;
}
