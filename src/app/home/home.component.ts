import { Component } from '@angular/core';
import { LoginService } from '../general/login/login.service';
import { ProfileComponent } from '../post/profile/profile.component';
import { CalendarService } from '../calendar/calendar.service';
import { PostService } from '../post/post-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewService } from '../post/view/view.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProfileComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  cursos: any[] = [];

  currentIndex = 0;
  code!: string;
  private intervalId: any;

  constructor(public login: LoginService, 
              public calendar: CalendarService, 
              private postService:PostService, 
              private router: Router, 
              private view:ViewService){}

  ngOnInit(){
    this.getCurses();
    this.view.getNotifications();
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  ngOnDestroy() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (this.currentIndex >= items.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.showSlide();
  }

  prevSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (this.currentIndex <= 0) {
      this.currentIndex = items.length - 1;
    } else {
      this.currentIndex--;
    }
    this.showSlide();
  }

  showSlide() {
    const items = document.querySelectorAll('.carousel-item');
    const carouselInner = document.querySelector('.carousel-inner') as HTMLElement;
    carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  getCurses(){
    //console.log(this.login.user);
    if(this.login.type==2){
      const file = {profesor_id: this.login.user};
        this.postService.getDocs("/docs/anibaesbobo", file).subscribe((courseData: any)=>{
          this.cursos = courseData;
          console.log(this.cursos);
      });
    }
    if(this.login.type==3){
      const file = {usuario_id: this.login.user};
        this.postService.getDocs("/docs/sesaresbobo", file).subscribe((data: any)=>{
          this.cursos = data;
          //console.log(this.cursos);
        });
    }
    if(this.login.type==1){
      this.cursos= [{title:"Prueba", idioma:"Inglés"}];
    }
    
  }

  gotoCurse(id:number){
    this.router.navigate(['/class/'+id]);
  }

  joinCourse(){
    this.calendar.openPopup("join");
  }

  submit(){
    const codeGet = {codigo: this.code};
    this.postService.getDocs("/docs/cursos", codeGet).subscribe((data: any)=>{
      if(data){
        const cursoId = data[0].id;
        const cursoName = data[0].title;
        //console.log(this.cursos);
        const create = {curso_id: cursoId, usuario_id:this.login.user}
        this.postService.create("/curso_integrantes", create).subscribe(success => {
          if (success) {
            this.view.goTo("/home");
            alert('Bienvenido a '+cursoName);
            window.location.reload();
          } else {
            alert('Creacion fallida');
          }
        });
      }
      else{
        alert("Codigo No encontrado");
      }
    });
  }




}
