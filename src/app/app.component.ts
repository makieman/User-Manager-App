import { Component } from '@angular/core';
import { ToastComponent } from './toast/toast';
import { NavigationComponent } from './navigation/navigation';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastComponent, NavigationComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'user-manager';

}