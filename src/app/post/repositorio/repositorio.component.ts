import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PostService } from '../post-service.service';
import { TableService } from '../table.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewService } from '../view/view.service';

@Component({
  selector: 'app-repositorio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repositorio.component.html',
  styleUrl: './repositorio.component.css'
})
export class RepositorioComponent {

UploadForm!: FormGroup;
selectedFile: File | null = null;

constructor(public view: ViewService, private table: TableService){}




}
