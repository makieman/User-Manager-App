import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);

  getToast(): Observable<Toast | null> {
    return this.toastSubject.asObservable();
  }

  showSuccess(message: string): void {
    this.toastSubject.next({ message, type: 'success' });
  }

  showError(message: string): void {
    this.toastSubject.next({ message, type: 'error' });
  }

  hide(): void {
    this.toastSubject.next(null);
  }
}
