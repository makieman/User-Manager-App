import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    active: [true],
  });
  isEdit = false;
  isSubmitting = false;
  private id?: number;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const idParam = params.get('id');
          if (idParam) {
            this.isEdit = true;
            this.id = +idParam;
            return this.userService.getUser(idParam);
          }
          return of(null);
        }),
      )
      .subscribe((user) => {
        if (user) {
          this.userForm.patchValue(user);
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const userData = this.userForm.value as Omit<User, 'id'>;

    const saveObservable = this.isEdit && this.id
      ? this.userService.updateUser(this.id, userData)
      : this.userService.addUser(userData);

    saveObservable
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(() => this.router.navigate(['/users']));
  }
}