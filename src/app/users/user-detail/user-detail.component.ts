import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { Observable, switchMap, catchError, EMPTY } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgClass, TitleCasePipe, RouterLink],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.scss'] // This connects your stylesheet
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  user$: Observable<User> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.userService.getUser(id).pipe(catchError(() => {
        this.toastService.error('User not found.');
        this.router.navigate(['/users']);
        return EMPTY;
      }));
    })
  );

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.toastService.success('User deleted successfully!');
        this.router.navigate(['/users']);
      });
    }
  }
}