import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './general/login/login.component';
import { authGuard } from './auth.guard'; // Adjust the path as necessary
import { RegisterComponent } from './general/register/register.component';
import { ViewComponent } from './post/view/view.component';
import { HomeComponent } from './home/home.component';
import { CursosComponent } from './post/cursos/cursos.component';
import { CreateComponent } from './post/create/create.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'home', component: HomeComponent, canActivate: [authGuard]},
    { path: 'calendar', component: CalendarComponent, canActivate: [authGuard]},
    { path: 'cursos', component: CursosComponent, canActivate: [authGuard]},
    { path: 'crear', component: CreateComponent, canActivate: [authGuard]},
    { path: 'class/:PostId', component: ViewComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: 'login' }  // Wildcard route redirecting to HomeComponent


];
