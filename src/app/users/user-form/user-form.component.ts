// filepath: user-manager/src/app/users/user-form/user-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ToastService } from '../../toast/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
})

export class UserFormComponent {   // <-- FIXED: was ToastService
  userForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      active: [true]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.isSubmitting = true;

    this.userService.addUser(this.userForm.value).subscribe({
      next: () => {
        this.toastService.success('User added successfully!');
        this.userForm.reset({ role: 'user', active: true });
        this.isSubmitting = false;
      },
      error: () => {
        this.toastService.error('Failed to add user.');
        this.isSubmitting = false;
      }
    });
  }
}
