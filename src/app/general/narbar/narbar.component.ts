import { Component, HostListener } from '@angular/core';
import { LoginService } from '../login/login.service';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../../post/notifications/notifications.component';
import { ViewService } from '../../post/view/view.service';

@Component({
  selector: 'app-narbar',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './narbar.component.html',
  styleUrl: './narbar.component.css'
})
export class NarbarComponent {
  
  
  popupVisible = false;
  
  constructor(public login: LoginService){}

  togglePopup() {
    this.popupVisible = !this.popupVisible;
    //console.log(this.popupVisible);
  }

  

}
