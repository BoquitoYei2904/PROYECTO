import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../general/login/login.service';
import { PostService } from '../post-service.service';
import { TableService } from '../table.service';
import { ViewService } from '../view/view.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  profileForm!: FormGroup;
  form!: FormGroup;
  fields: any;
  //fields: {id: string, name: string, lastname: string, personalid: string, email: string, phone: string, address: string, age: string, curso_id: string}[] = [];
  editMode = false;
  profilePicture: string | ArrayBuffer | null = null;

  userId=0;

  constructor( public login: LoginService, private postService:PostService, private table:TableService, public view:ViewService) {
    /*this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      address: [''],
      age: [''],
      password: ['']  // Añadido para el cambio de contraseña
    });*/
  }

  ngOnInit(): void {
    //this.loadUserProfile();
    const credencials = {id: this.login.user};
    //console.log(this.login.user);
    
    this.postService.getDocs('/docs/usuarios', credencials).subscribe((data: any)=>{
      this.fields = data[0]; // Assign the first item from the array to fields
      //console.log(this.fields);
    });

  }

  loadUserProfile() {
    this.profileForm.setValue({ password: '' });
    this.profilePicture = 'path/to/default/profile/picture.jpg'; // Ruta a la imagen de perfil por defecto
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.loadUserProfile(); // Revertir cambios si se cancela la edición
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profilePicture = e.target.result;
        }
    };
    reader.readAsDataURL(input.files[0]); 
  }
  }
  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Aquí puedes guardar los datos del perfil del usuario en una API o un servicio
      this.editMode = false;
    }
  }



}
