import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './general/login/login.service';


export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    authService.idk();
    return true;
  } else {
    router.navigateByUrl('/**');
    return false;
  }


};
