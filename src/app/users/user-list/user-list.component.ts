import { UsersService } from '../user.service'; // Correct import
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common'; // ✅ Added TitleCasePipe
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, catchError, EMPTY, tap, finalize } from 'rxjs';
import { User } from '../user.model';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
    TitleCasePipe, // ✅ Added here
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.scss'],
})
export class UserListComponent {
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

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
