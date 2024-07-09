import { Component } from '@angular/core';
import { ViewService } from '../view/view.service';
import { TableService } from '../table.service';
import { PostService } from '../post-service.service';
import { FormBuilder, FormGroup, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  form!: FormGroup;
  fkIdi: any[]=[];
  fkProf: any[]=[];
  
  constructor(private view:ViewService,public table: TableService, private postService: PostService){}

  ngOnInit(){
    this.form = this.table.cursosform;
    this.view.getNotifications();

    this.postService.getFk("idiomas").subscribe((data: any)=>{
      this.fkIdi = data;
      console.log(this.fkIdi);
    });
    
    const temp = {rol_id:2};//para profesores
    this.postService.getDocs("/docs/usuarios", temp).subscribe((data: any)=>{
      this.fkProf = data;
      console.log(this.fkProf);
    });
  }


  onSubmit() {
    
    this.postService.create("/cursos",this.form.value).subscribe(success => {
      if (success) {
        alert('Curso Añadido de Manera correcta!!');
        this.view.goTo("/home");
      } else {
        alert('Course creation failed');
      }
    });
    
  }

}
