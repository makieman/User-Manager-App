import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class ToastComponent implements OnInit {
  toast$: Observable<Toast | null>;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.getToast();
  }

  ngOnInit(): void {
    this.toast$.subscribe(toast => {
      if (toast) {
        setTimeout(() => {
          this.toastService.hide();
        }, 3000);
      }
    });
  }

  hideToast(): void {
    this.toastService.hide();
  }
}
