import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const routesWithAuth = ['/unpublished', '/published', '/profile', '/logout'];
    const currentRoute = state.url;
    const checkAuth = await this.auth.isAuthenticated();

    // Check if route requires auth
    if (routesWithAuth.includes(currentRoute)) {
      if (!checkAuth) {
        this.router.navigate(['/login']);

        return false;
      } else {
        return true;
      }
    } else {
      if (checkAuth) {
        this.router.navigate(['/unpublished']);

        return false;
      } else {
        return true;
      }
    }
  };
}
