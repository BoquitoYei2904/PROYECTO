import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  user!: number;
  type!: number;
  log!: number;

  constructor(private router: Router) {}

  idk(){
    const credencials = this.getCrendetials();
    if (credencials==null){
      this.type=3;
      this.log=0;
      console.log(this.type+" Estudiante (modoVanilla)");
      console.log(this.log+" No Login");
    }
    else{
      this.user = credencials.this;
      this.type = credencials.type;
      this.log = 1;
      console.log(this.user+" id del usuario");
      console.log(this.type+" Tipo de usuario:"+(this.type == 1? " administrador" : this.type == 2? " profesor":" estudiante"));
    }
  }


  login(user: number, rol:number) {
    if (typeof window !== 'undefined') {
    const token = "fkaodkw";
    localStorage.setItem('authToken', JSON.stringify({id:token, this:user, type:rol}));
    }
  }

  logout() {
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      this.getCrendetials();
      this.router.navigate(['/login']);
      /*this.navbar.Admin = 0;
      this.navbar.isAdmin();
      this.clock.smt = "none";*/
    }
  }

  isLoggedIn(): boolean {

    if (typeof window !== 'undefined') {
      // Check if running in the browser
      let temp = localStorage.getItem('authToken');
      let temp1 = JSON.parse(temp!);
      //console.log(temp1);

    return !!temp1.id;
    }
    return false;
  }

  getCrendetials(){
    if (typeof window !== 'undefined') {
      const temp = JSON.parse(localStorage.getItem('authToken')!);
      return temp!;
    }
    
  }

  

}