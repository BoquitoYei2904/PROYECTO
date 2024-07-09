import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { TableService } from '../../post/table.service';
import { PostService } from '../../post/post-service.service';
import { CalendarService } from '../../calendar/calendar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  form!: FormGroup;
  pasword!: string;

  constructor(private router: Router, private PostService: PostService, public login: LoginService, public table: TableService, private calendar:CalendarService) {}
  
  ngOnInit(): void {
    this.form = this.table.RegisterForm;
     }

  OnSubmit() {
    
    this.PostService.create(this.form.value, "/usuarios").subscribe(success => {
      if (success) {
        this.createPassKey();
      } else {
        alert('Registration failed');
      }
    });
  }
  createPassKey(){
    const credencials = { usuario_id: '', password: '' };
    const getID = {email:this.form.value.email};
    const correo = this.form.value.email;
    this.PostService.getDocs("/docs/usuarios", getID).subscribe((data: any)=>{
      
      //credencials.usuario_id = data[0].usuario_id;
      if(data){
        credencials.usuario_id = data[0].id;
        const overlay = document.getElementById('popupOverlay') as HTMLInputElement | null;
        const popup = document.querySelector('.popupCard') as HTMLInputElement | null;
        const submitBtn = document.getElementById('closeDownloadBtn');
        const correoElement = document.getElementById('correo');

        overlay!.classList.add('visible');

        if (correoElement) {
          correoElement.innerText = correo;
        }

        window.setTimeout(() => {
          popup!.classList.add('open');
          popup!.style.left = "35%";
        }, 10);
        
        submitBtn!.addEventListener('click', () => {
          
          //console.log(this.pasword);
          credencials.password = this.pasword;
          //console.log(credencials);
          
          this.PostService.create("/credenciales", credencials,).subscribe(success => {
            if (success) {
              alert('Usuario creado');
              this.router.navigate(['/']);
            } else {
              alert('Registration failed');
            }
          });


          popup!.classList.add('close');
          window.setTimeout(() => {
              overlay!.classList.remove('visible');
              popup!.classList.remove('open');
              popup!.classList.remove('close');
          }, 100);

        });
      }else{
        alert("Ha ocurrido un error");
      }
      
    });
    //console.log(this.form.value.email);
  }
  
}
