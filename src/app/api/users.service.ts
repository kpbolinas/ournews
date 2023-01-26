import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  constructor(private service: ApiService) {}

  // Login API
  login = (data: HttpParams) => {
    return this.service.postRequest('/login', data);
  };

  // Logout API
  logout = () => {
    return this.service.postRequest('/logout');
  };

  // Forgot Password API
  forgotPassword = (data: HttpParams) => {
    return this.service.postRequest('/forgot-password', data);
  };

  // Verification API
  verification = (data: HttpParams) => {
    return this.service.postRequest('/verification', data);
  };

  // Profile API
  profile = () => {
    return this.service.getRequest('/profile');
  };

  // Edit Info API
  editInfo = (data: HttpParams) => {
    return this.service.patchRequest('/edit-info', data);
  };

  // Change Password API
  changePassword = (data: HttpParams) => {
    return this.service.patchRequest('/change-password', data);
  };
}
