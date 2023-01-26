import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { UsersService } from 'src/app/api/users.service';
import { SpinnerService } from 'src/app/common/spinner/spinner.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ModalService } from 'src/app/common/modal/modal.service';

interface Profile {
  id?: number;
  email?: string,
  first_name?: string,
  last_name?: string
}

interface eiFormError {
  first_name?: string,
  last_name?: string
}

interface cpFormError {
  password?: string,
  new_password?: string,
  confirm_new_password?: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  profileEvent: any;
  eiEvent: any;
  cpEvent: any;
  info: Profile = {};
  eiFormErrors: eiFormError = {};
  cpFormErrors: cpFormError = {};

  editInfoForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl('')
  });

  changePasswordForm = new FormGroup({
    password: new FormControl(''),
    new_password: new FormControl(''),
    confirm_new_password: new FormControl('')
  });

  editInfoModal: any;
  changePassModal: any;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.editInfoModal = this.modalService.parseModal('#ei-modal');
    this.changePassModal = this.modalService.parseModal('#cp-modal');
  }

  loadProfile = () => {
    this.spinnerService.show();
    this.profileEvent = this.usersService.profile()
      .subscribe({
        next: response => {
          const { data } = response;
          this.info = data;
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;
        
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  handleEditInfo = () => {
    this.spinnerService.show();
    this.eiFormErrors = {};
    const { first_name, last_name } = this.editInfoForm.value;
    const formData = new HttpParams()
      .set('first_name', first_name || '')
      .set('last_name', last_name || '');
    
    this.eiEvent = this.usersService.editInfo(formData)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
          this.loadProfile();
          this.editInfoModal.hide();
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;

            case 422:
              this.eiFormErrors = response.error.errors;
              break;
          
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  handleChangePass = () => {
    this.spinnerService.show();
    this.cpFormErrors = {};
    const { password, new_password, confirm_new_password } = this.changePasswordForm.value;
    const formData = new HttpParams()
      .set('password', password || '')
      .set('new_password', new_password || '')
      .set('confirm_new_password', confirm_new_password || '');
    
    this.eiEvent = this.usersService.changePassword(formData)
      .subscribe({
        next: response => {
          const { message } = response;
          this.toastService.show(message, 'success');
          this.loadProfile();
          this.changePassModal.hide();
        },
        error: response => {
          this.spinnerService.hide();
          switch (response?.status) {
            case 401:
              localStorage.setItem('auth-info', '');
              this.router.navigate(['/unauthorized']);
              break;

            case 422:
              this.cpFormErrors = response.error.errors;
              break;
          
            default:
              this.toastService.show(response.error?.message);
              break;
          }
        },
        complete: () => this.spinnerService.hide()
      });
  };

  showEditInfoForm = () => {
    this.editInfoForm.reset({
      first_name: this.info.first_name,
      last_name: this.info.last_name
    });
    this.eiFormErrors = {};
    this.editInfoModal.show();
  };

  showChangePassForm = () => {
    this.changePasswordForm.reset();
    this.cpFormErrors = {};
    this.changePassModal.show();
  };

  ngOnDestroy() {
    if (this.profileEvent) {
      this.profileEvent.unsubscribe();
    }
    if (this.eiEvent) {
      this.eiEvent.unsubscribe();
    }
    if (this.cpEvent) {
      this.cpEvent.unsubscribe();
    }
  }
}
