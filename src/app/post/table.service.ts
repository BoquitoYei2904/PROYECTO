import { Injectable } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CalendarService } from '../calendar/calendar.service';

@Injectable({
    providedIn: 'root'
})
export class TableService {
  
    table: string = "/test"; // Define your default table value here
    start: string = "";
    end: string = "";

    constructor(){}

    constFormat = {
        title: 'text',
        description: 'text',
        
    }
    cursosform = new FormGroup({

        title: new FormControl('', [Validators.required]),
        idioma_id: new FormControl('', [Validators.required]),
        profesor_id: new FormControl('', [Validators.required]),
        modalidad: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        codigo: new FormControl('', [Validators.required]),
    });

    fileform = new FormGroup({
        file: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        curso_id: new FormControl('', [Validators.required])
    });

    notifiform= new FormGroup({
        usuario_id: new FormControl('', [Validators.required]),
    });

    Eventform = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        curso_id: new FormControl('', [Validators.required]),
        dia: new FormControl('', [Validators.required]),
        alerta: new FormControl('', [Validators.required]),
        inicio: new FormControl('', [Validators.required]),
        final: new FormControl('', [Validators.required]),
        status: new FormControl('1', [Validators.required])
    });

    curse = new FormGroup({

    });


    Docforms = new FormGroup({
        id: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        curso_id: new FormControl('', [Validators.required]),
        size: new FormControl('', [Validators.required]),
        uploaded_at: new FormControl('', [Validators.required]),
        path: new FormControl('', [Validators.required]),
    });

    loginForm = new FormGroup({
        correo: new FormControl('', Validators.required),
        contraseña: new FormControl('', Validators.required),
      });
      
    RegisterForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        personalid: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        age: new FormControl('', [Validators.required]),


    });

}