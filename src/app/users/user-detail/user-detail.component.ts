import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { ToastService } from '../../toast/toast.service';
import { switchMap } from 'rxjs';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  user$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return this.userService.getUser(Number(id));
    })
  );

  deleteUser(id: number) {
    this.userService.deleteUser(id);
    this.toastService.success('User deleted successfully');
    this.router.navigate(['/users']);
  }
}
