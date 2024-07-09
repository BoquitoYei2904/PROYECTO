import { Component } from '@angular/core';
import { RepositorioComponent } from '../repositorio/repositorio.component';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from './view.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProfileComponent } from '../profile/profile.component';
import { LoginService } from '../../general/login/login.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [RepositorioComponent, ProfileComponent, NotificationsComponent,CommonModule, ReactiveFormsModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  activeComponent: string = 'repositorio';  // Default to 'repositorio'

  constructor(private route: ActivatedRoute, public view: ViewService, public login:LoginService){}

  ngOnInit(){
    this.view.id = this.route.snapshot.params['PostId'];
    this.view.getFk();
    this.view.getDocs();
    this.view.getNotifications();
    this.view.getStudents();
    this.view.getCursoInfo();
  }

  showComponent(component: string) {
    this.activeComponent = component;
  }



}
