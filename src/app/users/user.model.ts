export interface User {
  _id?: string; // ✅ MongoDB field
  id?: number;  // optional in case we ever use numeric IDs
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  active: boolean;
  createdAt?: string | Date;
  lastLogin?: string | Date;
}
