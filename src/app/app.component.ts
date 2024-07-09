import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NarbarComponent } from './general/narbar/narbar.component';
import { LoginComponent } from './general/login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FooterComponent } from './general/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NarbarComponent, LoginComponent, CalendarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
}
