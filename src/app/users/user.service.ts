import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // ✅ Use your backend API base. If you have a proxy.conf.json, leave as '/users'
  // Otherwise: private apiUrl = 'http://localhost:3000/users';
  private apiUrl = '/users';
  private http = inject(HttpClient);

  // ✅ Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // ✅ Use string, not number (Mongo _id)
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // ✅ Add new user
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // ✅ Update user (PUT + use _id)
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // ✅ Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
