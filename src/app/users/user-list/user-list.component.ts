import { UsersService } from '../user.service'; // Correct import
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common'; // ✅ Added TitleCasePipe
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, catchError, finalize, switchMap, tap } from 'rxjs';
import { User } from '../user.model';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    TitleCasePipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.scss'],
})
export class UserListComponent {
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private refreshUsers$ = new BehaviorSubject<void>(undefined);

  loading = false;
  error = '';
  isSubmitting = false;

  users$: Observable<User[] | null> = this.refreshUsers$.pipe(
    tap(() => {
      this.loading = true;
      this.error = '';
    }),
    switchMap(() =>
      this.usersService.getUsers().pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          console.error('Could not fetch users:', err);
          this.error = 'Failed to load users.';
          this.toastService.error(this.error);
          return EMPTY;
        })
      )
    )
  );

  addUser() {
    this.router.navigate(['/users/new']); // 👈 make sure this route exists
  }

  editUser(id: string) {
    this.router.navigate(['/edit-user', id]); // ✅
  }

  deleteUser(id: string | undefined): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isSubmitting = true;
      this.usersService.deleteUser(id!).subscribe({
        next: () => {
          this.toastService.success('User deleted successfully!');
          this.refreshUsers$.next();
        },
        error: (err: any) => {
          console.error('Could not delete user:', err);
          this.toastService.error('Failed to delete user.');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
