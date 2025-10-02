import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, catchError, EMPTY } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [AsyncPipe, NgForOf, RouterLink, NgClass, NgIf],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  private router = inject(Router);
  private userService = inject(UserService);

  private refreshUsers$ = new BehaviorSubject<void>(undefined);

  users$: Observable<User[]> = this.refreshUsers$.pipe(
    switchMap(() => this.userService.getUsers().pipe(
      catchError(err => {
        console.error('Could not fetch users:', err);
        // In a real app, you might show a toast notification here
        return EMPTY; // Return an empty observable to prevent the stream from breaking
      })
    )),
  );

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // In a real app, you might show a success toast
          this.refreshUsers$.next();
        },
        error: (err: any) => {
          console.error('Could not delete user:', err);
          // In a real app, you might show an error toast
        },
      });
    }
  }
}