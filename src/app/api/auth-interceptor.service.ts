import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set Authorization Token
    const authStorage = localStorage.getItem('auth-info');
    if (authStorage) {
      const auth = JSON.parse(authStorage);
      const authToken = auth?.token ? 'Bearer ' + auth.token : '';
      const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
