import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import here

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TableService } from '../post/table.service';
import { PostService } from '../post/post-service.service';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class CalendarService {

    form!: FormGroup;
    labels = [];
    title= "";
    controlNames: string[] = [];

    //idk man, i lost my mind
    DBnames: string[] = [];
    mergedArray: { id: string,  type: string}[] = [];
    mergedObject = {};

    //To give the selected data to the create
    daySended: string = "";
    startSended: string = "";
    endSended: string = "";

    //get the names of the foreign key
    fk: any[] = [];

    //set a num value to different escenarios that im too lazy to make a table
    aviso = [{amount: 3600, title:"Una Hora Antes"},{amount: 1800, title:"Media Hora antes"},{amount: 90, title:"15 Minutos Antes"},{amount: 0, title:"no avisar"}];

    //to place the days of the week
    week: { day: string, date: string, num: number }[] = [];

    //to marked the begining and the end of the week before doing the api call
    init = "";
    end = "";

    //to place the information of the events in said week
    eventsWeek: {id: number, dia: string, entrada: string, final: string}[] = [];

    //to interchange the colors of the events
    cardColors = ["#3454d1", "#34d1bf", "#d1345b", "#f39237"];

    
    constructor(public forms: TableService, private postService: PostService, private router: Router, private location: Location){}

    smt(){

        this.form = this.forms.Eventform;
        const DBnames = Object.keys(this.form.controls).filter(key => Object.keys(this.forms.constFormat).includes(key));
        //const controlNames = DBnames.map(key => {return key.split('_')[0].toUpperCase();});
        const typeNames = Object.values(this.forms.constFormat);

        //console.log(DBnames);
        //console.log(controlNames);

        this.mergedArray = DBnames.map((DBname, index) => {
            return {
                id: DBname,
                type: typeNames[index] // Assuming you want to pair DBname with controlNames
              };
        });
    /*
        console.log(this.mergedArray);*/
        
    }
    //agregar nuevo evento
    submit(){
        this.form.value.inicio = this.form.value.inicio+":00";
        this.form.value.final = this.form.value.final+":00";
        console.log(this.form.value);
        this.postService.create("/eventos", this.form.value).subscribe((res:any) => {
            alert('Post created successfully!');
            window.location.reload();
        })
        
    }
    

    getRange(start:string | null, end:string | null, day: string | null){

        if(start !== null){
            const startTemp = start!.split(":00 ");
            const endTemp = end!.split(":00 ");

            var startHour = startTemp[1] === "AM" && startTemp[0] === "12" ? parseInt(startTemp[0])+12: 
                            startTemp[1] === "PM" && startTemp[0] === "12"? parseInt(startTemp[0]): 
                            startTemp[1] === "AM" ? parseInt(startTemp[0]) : parseInt(startTemp[0])+12;

            var endHour =   endTemp[1] === "AM" && endTemp[0] === "12" ? parseInt(endTemp[0])+12: 
                            endTemp[1] === "PM" && endTemp[0] === "12"? parseInt(endTemp[0]): 
                            endTemp[1] === "AM" ? parseInt(endTemp[0]) : parseInt(endTemp[0])+12;

            // ORDENAR SI SELECCIONADOS ALREVEZ
            var temp =0;
            startHour = startHour! > endHour! ? temp = startHour! : startHour = startHour!;
            startHour = startHour == temp ? startHour = endHour! : startHour = startHour;
            endHour = endHour! == startHour && temp!= 0 ? endHour = temp : endHour = endHour!;

            startHour = startHour! - 1;//REDUCIR EL INICIO A LA FILA ANTERIOR
            endHour == 24 ? endHour = 0 : endHour;//EN CASO DE SER EL TOPE
            
            var prepareStart = startHour < 10? 0+(startHour.toString())+":00": startHour+":00";
            this.form.get('inicio')?.setValue(prepareStart);
            var prepareEnd = endHour < 10? 0+(endHour.toString())+":00": endHour+":00";
            this.form.get('final')?.setValue(prepareEnd);
            this.form.get('dia')?.setValue(day);

            //console.log(prepareStart);
            //console.log(prepareEnd);
        }
        else {
            console.log("no hour especified");
        }
        
    }

    openPopup(display: string){
        const overlay = document.querySelector('.overlay') as HTMLInputElement | null;
    
        //for the create
        if(display==="create"){
            const diaInput = document.getElementById('dia') as HTMLInputElement | null;
            const popup = document.querySelector('.popupCard');
            const closePopupBtn = document.getElementById('closePopupBtn');
            overlay!.classList.add('visible');
            window.setTimeout(() => {
                popup!.classList.add('open');
            }, 10);

            closePopupBtn!.addEventListener('click', () => {

                popup!.classList.add('close');
                diaInput!.value ="";
                window.setTimeout(() => {
                    overlay!.classList.remove('visible');
                    popup!.classList.remove('open');
                    popup!.classList.remove('close');
                }, 100);
            });
        }

        //for the download pdf
        if(display==="download"){
            const diaInput = document.getElementById('dia') as HTMLInputElement | null;
            const popup = document.getElementById('shh') as HTMLInputElement | null;
            const closePopupBtn = document.getElementById('closeDownloadBtn');
            overlay!.classList.add('visible');
            window.setTimeout(() => {
                popup!.classList.add('open');
                popup!.style.top = "-40%";
                overlay!.style.backgroundColor= "rgba(34, 32, 32, 0.98)";
                
            }, 10);
    
            closePopupBtn!.addEventListener('click', () => {
    
                popup!.classList.add('close');
                //diaInput!.value ="";
                window.setTimeout(() => {
                    overlay!.classList.remove('visible');
                    popup!.classList.remove('open');
                    popup!.classList.remove('close');
                }, 100);
            });
        }

        if(display==="join"){
            const popup = document.querySelector('.popupCard');
            const closePopupBtn = document.getElementById('closePopupBtn');
            overlay!.classList.add('visible');
            window.setTimeout(() => {
                popup!.classList.add('open');
            }, 10);

            closePopupBtn!.addEventListener('click', () => {
                popup!.classList.add('close');
                window.setTimeout(() => {
                    overlay!.classList.remove('visible');
                    popup!.classList.remove('open');
                    popup!.classList.remove('close');
                }, 100);
            });
        }
    }

    getEvents(){
        var rango = {inicio: this.init, final: this.end};
        //console.log(this.init+" "+this.end);

        this.postService.getFk("cursos").subscribe((data: any)=>{
            this.fk = data;
            //console.log(this.fk);
        });
        
        this.postService.week("eventos", rango).subscribe((data: any)=>{
            //console.log(data);
            this.eventsWeek = data.map((dia:any, index:number) => {
                //dia limpio
                const date = dia.dia.split("T")[0];
                const found = this.week.find((item:any) => item.date === date);

                //position on calentar
                var start = dia.inicio.split(":")[0];
                start = parseInt(start);
                var end= dia.final.split(":")[0];
                end = parseInt(end);
                var perHeight = end - start;
                perHeight = perHeight*100;
                start = start+1;
                var startTemp = start > 12 ? ((start-12)+":00 PM").toString() : 
                            start == 12 ? (start+":00 PM").toString() : 
                            start == 0 ? ((start = 1)+":00 PM").toString() : (start+":00 AM").toString();

                //creacion del elemento
                
                const element = document.getElementById((found!.day)+" "+startTemp) as HTMLElement | null;
                const cardElement = document.createElement('div');
                cardElement.classList.add('event-card');
                cardElement.style.height = perHeight+"%";
                cardElement.style.backgroundColor = this.cardColors[index % this.cardColors.length];

                const insideElement = document.createElement('div');
                insideElement.classList.add('col');

                const hour = document.createElement('div');
                hour.classList.add('row');
                hour.classList.add('cardHour');
                hour.textContent = (dia.inicio.split(":00")[0]+":00")+" - "+(dia.final.split(":00")[0]+":00");

                const title = document.createElement('div');
                title.classList.add('row');
                title.classList.add('cardTitle');
                title.textContent = dia.title;

                const curse = document.createElement('div');
                curse.classList.add('row');
                curse.classList.add('cardCurse');
                this.fk.map((smt:any) =>{
                    if(smt.id === dia.curso_id)
                        curse.textContent = smt.title;
                });
                insideElement.appendChild(hour);
                insideElement.appendChild(title);
                insideElement.appendChild(curse);
                cardElement.appendChild(insideElement);
                element!.appendChild(cardElement);
                //console.log(found!.day+" "+start+":00");

                return {id:dia.id, dia: found!.day, entrada: dia.inicio, final: dia.final}
            });
            //console.log(this.eventsWeek);
        });

      }

    changeCSSVariable(variable:any, value:any) {
        document.documentElement.style.setProperty(variable, value);
    } 

}