import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PostService } from '../post-service.service';
import { ProfileComponent } from '../profile/profile.component';
import { ViewService } from '../view/view.service';
import { LoginService } from '../../general/login/login.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent {

  posts: any[] = [];
  headers: string[] = [];
  
  constructor(private postService:PostService, public view:ViewService, public login:LoginService){}

  ngOnInit(){
    this.view.getNotifications();
    this.postService.read("/anibaesbobo").subscribe((data: any[])=>{
      this.posts = data;
      //console.log(this.posts[0]);
      const temp = Object.keys(this.posts[0]);
        this.headers = temp.map(key => {return key.split('_')[0];});
        //console.log(this.headers);
    });
  }
  

}
