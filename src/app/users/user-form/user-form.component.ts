import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { UsersService } from '../user.service';
import { ToastService } from '../../toast/toast.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  isEdit = false;
  private userId: string | null = null; // ✅ now string

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      active: [true], // Default to active for new users
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = id; // ✅ keep as string
      this.usersService.getUser(this.userId).subscribe((user) => {
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            active: user.active,
          });
        }
      });
    }
  }
  onSubmit() {
    if (this.userForm.invalid) return;
    this.isSubmitting = true;

    const formValue = this.userForm.value;
    const userPayload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      role: formValue.role,
      active: formValue.active,
    };

    if (this.isEdit && this.userId) {
      this.usersService.updateUser(this.userId, userPayload).subscribe({
        next: () => {
          this.toastService.success('User updated successfully!');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toastService.error('Failed to update user.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.usersService.addUser(userPayload).subscribe({
        next: () => {
          this.toastService.success('User added successfully!');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toastService.error('Failed to add user.');
          this.isSubmitting = false;
        },
      });
    }
  }
}
