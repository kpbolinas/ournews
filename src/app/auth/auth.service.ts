import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { UserRoles } from '../constants/user.role';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  isAuthenticated = async () => {
    const authStorage = localStorage.getItem('auth-info');
    if (authStorage) {
      const auth = JSON.parse(authStorage);
      const authRole = auth?.role;

      if (authRole !== UserRoles.REPORTER) {
        localStorage.setItem('auth-info', '');

        return false;
      }
      
      await this.apiService.getRequest('/validate-token')
        .subscribe(
          null,
          response => {
            if (response?.status === 401) {
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
            }
            this.toastService.show(response.error?.message);
          }
        );

      return true;
    } else {
      return false;
    }
  };
}
