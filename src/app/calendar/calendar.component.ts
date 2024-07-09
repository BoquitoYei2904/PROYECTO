import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CalendarService } from './calendar.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post/post-service.service';
import { ViewEncapsulation } from '@angular/core';
import { PdfGeneratorService } from '../post/pdf.service';
import { ProfileComponent } from '../post/profile/profile.component';
import { ViewService } from '../post/view/view.service';
import { LoginService } from '../general/login/login.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProfileComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {


  data = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  month = [{id:1, name:"Enero"},{id:2, name:"Febrero"}, {id:3, name:"Marzo"}, {id:4, name:"Abril"}, {id:5, name:"Mayo"}, {id:6, name:"Junio"},
  {id:7, name:"Julio"}, {id:8, name:"Agosto"}, {id:9, name:"Septiembre"}, {id:10, name:"Octubre"}, {id:11, name:"Noviembre"}, {id:12, name:"Diciembre"}];

  hours = [
    "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM",
  ];

focusedCell: any = null;
emphasizedDay: any = null;
today!: number;
offset: number = 0;

//Nose, analizar
isSelecting = false;
selectionStart: { day: string, hour: string } | null = null;
selectionEnd: { day: string, hour: string } | null = null;
SelectedDay: string | null = null;
SendedDate: string | null = null;
currentMonthYear: string | null = null;

constructor(@Inject(PLATFORM_ID) private platformId: Object, public calendar: CalendarService, private pdf:PdfGeneratorService, public view:ViewService, public login:LoginService){}


ngOnInit(): void {

  const startDate = new Date();
  this.today = startDate.getDate();
  this.currentWeek(this.offset);
  this.view.getNotifications();
  this.calendar.smt();
  //this.calendar.changeCSSVariable('--cellheight', '70px');
  if (isPlatformBrowser(this.platformId)) {
    this.calendar.getEvents();
  }
}

ngAfterViewInit(): void {
  this.scrollStart();
}
// Add this to your component to listen for keydown events
@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.clearSelection();
  }
}

currentDay(day:number): boolean{
  return this.today === day;
}

currentWeek(offset: number){
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const startDate = new Date(); // Or any specific start date

  startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Set to the Monday of the current week

  startDate.setDate(startDate.getDate() + (offset * 7));  // Adjust the start date by the offset number of weeks

  //month and year respectively
  const moth = this.month.find(index => (startDate.getMonth()+1) === index.id);
  this.currentMonthYear = (moth!.name+" "+startDate.getFullYear());
  

  this.calendar.week = weekDays.map((day, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const num = date.getDate();
    if(date.getDay()=== 1){
      this.calendar.init = date.toLocaleDateString('en-CA');
    }
    if(date.getDay()=== 0){
      this.calendar.end = date.toLocaleDateString('en-CA');
    }
    //
    return { day: day, date: date.toLocaleDateString('en-CA'), num: num}; // Format date as 'YYYY-MM-DD'
  });
  //console.log(this.calendar.week);
  
  
}

scrollStart(): void{
  const container = document.querySelector('.calendar-container') as HTMLElement;
  const scrollToPosition = 800;

  container!.scrollTop = scrollToPosition;
}

startSelection(event: MouseEvent, day: string, hour: string): void {
  this.isSelecting = true;
  this.SelectedDay = day;
  this.selectionStart = { day, hour };
  this.selectionEnd = { day, hour };
  event.preventDefault(); // Prevent text selection during dragging
}

mouseMove(event: MouseEvent, day: string, hour: string): void {
  if (this.isSelecting && this.SelectedDay === day) {
    this.selectionEnd = { day, hour };
  }
}

//terminar la seleccion y sombreado cuando el mouse deja de seleccionar
endSelection(event: MouseEvent, day: string, hour: string): void {
  if (this.isSelecting) {
    this.isSelecting = false;
    //console.log(this.selectionStart);
    //console.log(this.selectionEnd);
    
  }
}

// quitar el sombreado con esc
clearSelection() {
  this.isSelecting = false;
  this.selectionStart = null;
  this.selectionEnd = null;
  this.calendar.form.get('final')?.setValue('');
  this.calendar.form.get('inicio')?.setValue('');
}

isCellInSelection(day: string, hour: string): boolean {
  if (!this.selectionStart || !this.selectionEnd || this.SelectedDay !== day) {
    return false;
  }

  const startHourIndex = this.hours.indexOf(this.selectionStart.hour);
  const endHourIndex = this.hours.indexOf(this.selectionEnd.hour);
  const currentHourIndex = this.hours.indexOf(hour);

  const isInHourRange = (startHourIndex <= currentHourIndex && currentHourIndex <= endHourIndex) ||
                        (startHourIndex >= currentHourIndex && currentHourIndex >= endHourIndex);

  return isInHourRange;
}

createEvent(){
  let thisDay = this.SelectedDay ?? null;
  let startHour = this.selectionStart?.hour ?? null;
  let endHour = this.selectionEnd?.hour ?? null;
  if(thisDay){
    const temp = this.SelectedDay ? this.calendar.week.find(dayObj => dayObj.day === this.SelectedDay) : null; 
    let date = temp!.date;
    this.calendar.getRange(startHour, endHour, date);
    console.log(date);
  }
  else{
    startHour = null;
    endHour = null;
    thisDay = "";
    this.calendar.getRange(startHour, endHour, thisDay);
    console.log('Date is null, cannot call getRange');
  }
  
  this.calendar.openPopup("create"); //open and close the create popout
}

downloadPdf(){
  const scroll = document.querySelector('.calendar-container') as HTMLElement;
  const popup = document.getElementById('shh') as HTMLInputElement | null;
  const popup2 = document.querySelector('.popupCard');
  const overlay = document.querySelector('.overlay') as HTMLInputElement | null;
  //const cells = document.querySelector('.calendarDataItem') as HTMLInputElement | null;
  let success = false;
  
  
  if (scroll) {
    scroll.style.height = '100%';
    this.calendar.changeCSSVariable('--cellheight', '54px');
    success = true;
    window.setTimeout(()=> {
      this.pdf.generatePdf('table', 'example-pdf');

      if(success == true){
        scroll.style.height = '550px';
        this.calendar.changeCSSVariable('--cellheight', '130px');
        popup2!.classList.add('close');
        popup!.classList.add('close');
        window.setTimeout(() => {
          overlay!.classList.remove('visible');
          popup2!.classList.remove('open');
          popup2!.classList.remove('close');
          popup!.classList.remove('open');
          popup!.classList.remove('close');
          overlay!.style.backgroundColor= "rgba(34, 32, 32, 0.5)";
        }, 100);
      }
    }, 500);
   
  }
  
  
  
}




}