// filepath: user-manager/src/app/toast/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'  // Corrected typo here
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  /** Show a success toast */
  success(message: string) {
    this.addToast(message, 'success');
  }

  /** Show an error toast */
  error(message: string) {
    this.addToast(message, 'error');
  }

  /** Show an info toast */
  info(message: string) {
    this.addToast(message, 'info');
  }

  /** Remove toast by ID */
  remove(id: number) {
    const updated = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(updated);
  }

  /** Internal helper */
  private addToast(message: string, type: 'success' | 'error' | 'info') {
    const id = ++this.idCounter;
    const toast: Toast = { id, message, type };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    // Auto-remove after 3s
    setTimeout(() => this.remove(id), 3000);
  }
}
