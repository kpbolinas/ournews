import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { UsersService } from 'src/app/api/users.service';
import { UserRoles } from 'src/app/constants/user.role';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginEvent: any;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private usersService: UsersService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  handleSubmit() {
    this.spinnerService.show();
    const { email, password } = this.loginForm.value;
    const formData = new HttpParams()
      .set('email', email || '')
      .set('password', password || '');

    this.loginEvent = this.usersService.login(formData)
      .subscribe({
        next: response => {
          const { data } = response;
          if (data.role !== UserRoles.REPORTER) {
            localStorage.setItem('auth-info', '');
            this.router.navigate(['/unauthorized']);
          } else {
            const auth = data ? JSON.stringify(data) : '';
            localStorage.setItem('auth-info', auth);
            this.router.navigate(['/unpublished']);
          }
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
    if (this.loginEvent) {
      this.loginEvent.unsubscribe();
    }
  }
}