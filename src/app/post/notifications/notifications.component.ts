import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ViewService } from '../view/view.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  constructor(public view: ViewService){}

}
