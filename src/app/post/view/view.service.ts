import { Injectable } from '@angular/core';
import { PostService } from '../post-service.service';
import { TableService } from '../table.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../general/login/login.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class ViewService {


    id!: number;
    form!: FormGroup;
    UploadForm!: FormGroup;
    fk: any[] = [];
    currentCurso!: string;
    profesor!: string;
    
    selectedFile: File | null = null;

    files: any[] = [];
    alerts: any[] = [];
    students: any[] = [];
    curso: any[] = [];

    constructor(private postService:PostService, private table:TableService, private login:LoginService, private router:Router){}

  
    getDocs(){
      this.form = this.table.fileform;
      this.form.patchValue({ curso_id: this.id });
      const file = {curso_id: this.id};
      this.postService.getDocs("/docs/documentos", file).subscribe((data: any)=>{
        this.files = data;
        console.log(this.files);
      });
    };

    getNotifications(){

        const file = {usuario_id: this.login.user};
        this.postService.getDocs("/docs/luiesbobo", file).subscribe((data: any)=>{
          this.alerts = data;
          console.log(this.alerts);
        });
    };

    getCursoInfo(){
      //this.form = this.table.cursosform;
      const file = {id: this.id};
      this.postService.getDocs("/docs/cursos", file).subscribe((data: any)=>{
        this.curso = data;
        console.log(this.curso);
        const pro = data[0].profesor_id;

        this.postService.getFk("usuarios").subscribe((data: any)=>{
          const found = data.find((item:any) => item.id == pro);
          this.profesor = found.name;
        });
      });
    }

    getFk(){
      this.postService.getFk("cursos").subscribe((data: any)=>{
        const found = data.find((item:any) => item.id == this.id);
        this.currentCurso = found.title;
      });
    };

    uploadFile(){
      
      if (!this.selectedFile) {
        console.error('No file selected.');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      //console.log(formData);
      //console.log(this.form.value);
    
      for (const key in this.form.value) {
        if (this.form.value.hasOwnProperty(key)) {
          formData.append(key, this.form.value[key]);
        }
      }
      
      this.postService.upload(formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          alert('File uploaded successfully');
          this.getDocs();
          // Handle success if needed

        },
        (error) => {
          console.error('Error uploading file', error);
          // Handle error if needed
        }
      );
    };
    
    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    };
      
    downloadFile(path:string) {
        const link = document.createElement('a');
        const file = path.split('\\')[2];
        link.href = 'assets/docs/'+file;
        //console.log(link.href);
        link.download = file;
        //console.log(link.download);
        link.click();
    };
    
    goTo(path:string){
      this.router.navigate(['/'+path]);
    }

    getStudents(){
      const courseObj = {id: this.id}
      this.postService.getDocs('/docs/sesaresbobo', courseObj).subscribe((studentsData: any)=>{
        this.students = studentsData;

        const userIds = studentsData.map((student: any) => student.usuario_id);

        this.postService.getFk("usuarios").subscribe((usersData: any) => {
          // Create a map for user ids to names
          const userIdToNameMap = usersData.reduce((map: any, user: any) => {
            map[user.id] = user.name;
            return map;
          }, {});
    
          // Map the students to objects containing only the name
          const studentsWithNameOnly = this.students.map((student: any) => {
            const name = userIdToNameMap[student.usuario_id];
            return { name };
          });

          this.students = studentsWithNameOnly;
          console.log(this.students);
        });
      });
    }


}