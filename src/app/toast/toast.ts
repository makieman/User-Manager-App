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
  toast$: Observable<Toast[]>;  // Change Toast | null to Toast[]

  constructor(public toastService: ToastService) {
    this.toast$ = this.toastService.toasts$;  // Access the toasts$ observable
  }
 
  ngOnInit(): void {}
}
