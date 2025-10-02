import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, NgClass, TitleCasePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [AsyncPipe, NgClass, TitleCasePipe, RouterLink, NgIf],
  templateUrl: './user-detail.html',
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  user$: Observable<User | undefined> = this.route.params.pipe(
    switchMap(params => {
      if (params['id']) {
        return this.userService.getUser(params['id']);
      }
      return EMPTY;
    })
  );

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => this.router.navigate(['/users']));
  }
}