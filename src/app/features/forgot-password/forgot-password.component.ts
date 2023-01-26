import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { UsersService } from 'src/app/api/users.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';

interface FormError {
  email?: string
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
  fpEvent: any;
  formErrors: FormError = {};

  forgotPasswordForm = new FormGroup({
    email: new FormControl('')
  });

  constructor(
    private usersService: UsersService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  handleSubmit() {
    this.spinnerService.show();
    this.formErrors = {};
    const { email } = this.forgotPasswordForm.value;
    const formData = new HttpParams()
      .set('email', email || '');

    this.fpEvent = this.usersService.forgotPassword(formData)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;
            
            case 422:
              this.formErrors = response.error.errors;
              break;
          
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  ngOnDestroy() {
    if (this.fpEvent) {
      this.fpEvent.unsubscribe();
    }
  }
}
