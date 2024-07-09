import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { PostService } from '../../post/post-service.service';
import { LoginService } from './login.service';
import { TableService } from '../../post/table.service';
import { ViewService } from '../../post/view/view.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  form!: FormGroup;

  
  /*------------------------------------------
  Created constructor
  --------------------------------------------*/
  constructor(
    public PostService: PostService,
    private router: Router,
    public login: LoginService,
    private table: TableService,
    private view:ViewService) {}


  ngOnInit(): void {
    this.login.idk();
    this.form = this.table.loginForm;

  }

  get f(){
    return this.form.controls;
  }

  OnLogin(){
    //console.log(this.form.value);
    this.PostService.check(this.form.value).pipe(
      catchError((error) => {
          console.error('Error occurred during login:', error);
          alert('Login failed. Please try again.');
          return of(null);
      })
    ).subscribe((res:any)=>{
      if(res){
      alert('Acceso concedido!!');
      console.log('Acceso concedido!');
      
      //login
      //dime que id de usuario ingreso
      //console.log(res);
      this.login.login(res.id, res.rol_id);
      this.view.getNotifications();
      this.router.navigateByUrl('/home');


      //this.login.idsession = res.id;
      //this.navbar.Admin = res.idrol;
      //this.navbar.isAdmin();
      }
    })

  }
    



}
  
