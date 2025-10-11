import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../user.service';
import { ToastService } from '../../toast/toast.service';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgClass],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);

  user$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.usersService.getUser(id).pipe(catchError(() => {
        this.toastService.error('User not found.');
        this.router.navigate(['/users']);
        return EMPTY;
      }));
    })
  );

  deleteUser(id: string | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.success('User deleted successfully!');
          this.router.navigate(['/users']);
        },
        error: () => this.toastService.error('Failed to delete user')
      });
    }
  }
}
