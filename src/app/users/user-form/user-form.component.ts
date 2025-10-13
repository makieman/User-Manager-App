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
  private userId: string | null = null;

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
      password: ['', Validators.required],
      role: ['user', Validators.required],
      active: [true],
      phone: [''],
      organization: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = id;
      this.usersService.getUser(this.userId).subscribe((user) => {
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            organization: user.organization || '',
            role: user.role,
            active: user.active,
          });
          // Remove password validator for edit mode
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        }
      });
    }
  }
onSubmit() {
  // Stop if form is invalid
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  const formValue = this.userForm.value;

  // Build payload; all required fields are guaranteed due to validators
  const userPayload: User = {
    firstName: formValue.firstName!.trim(),
    lastName: formValue.lastName!.trim(),
    email: formValue.email!.trim(),
    role: formValue.role!,
    active: formValue.active!,
    password: !this.isEdit || formValue.password ? formValue.password! : 'defaultPassword123', // fallback for edit
    phone: formValue.phone?.trim() || '',
    organization: formValue.organization?.trim() || '',
  };

  if (this.isEdit && this.userId) {
    // Update existing user
    this.usersService.updateUser(this.userId, userPayload).subscribe({
      next: () => {
        this.toastService.success('User updated successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to update user.');
        this.isSubmitting = false;
      },
    });
  } else {
    // Create new user
    this.usersService.addUser(userPayload).subscribe({
      next: () => {
        this.toastService.success('User added successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Failed to add user.');
        this.isSubmitting = false;
      },
    });
  }
}
}