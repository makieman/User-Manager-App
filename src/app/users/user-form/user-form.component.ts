// filepath: user-manager/src/app/users/user-form/user-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../user.service';
import { ToastService } from '../../toast/toast.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.scss'],
})

export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  isEdit = false;
  private userId: number | null = null;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(
  ) {
    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = +id; // Convert string 'id' to a number
      this.userService.getUser(this.userId).subscribe((user) => {
        if (user) {
          this.userForm.patchValue(user);
        }
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.isSubmitting = true;
 
    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userForm.value).subscribe({
        next: () => {
          this.toastService.success('User updated successfully!');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toastService.error('Failed to update user.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.userService.addUser(this.userForm.value).subscribe({
        next: () => {
          this.toastService.success('User added successfully!');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toastService.error('Failed to add user.');
          this.isSubmitting = false;
        }
      });
    }
  }
}
