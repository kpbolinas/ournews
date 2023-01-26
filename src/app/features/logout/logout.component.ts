import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/api/users.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent {
  logoutEvent: any;

  constructor(
    private usersService: UsersService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.logout();
  }

  logout = () => {
    this.spinnerService.show();
    this.logoutEvent = this.usersService.logout()
      .subscribe({
        next: () => {
          localStorage.setItem('auth-info', '');
          this.router.navigate(['/login']);
        },
        error: response => {
          this.spinnerService.hide();
          if (response?.status === 401) {
            localStorage.setItem('auth-info', '');
            this.router.navigate(['/unauthorized']);
          } else {
            this.toastService.show(response.error?.message);
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  ngOnDestroy() {
    if (this.logoutEvent) {
      this.logoutEvent.unsubscribe();
    }
  }
}
