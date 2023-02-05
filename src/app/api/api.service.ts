import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/common/toast/toast.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'X-Api-Token': environment.apiToken
    }),
    withCredentials: true
  };

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private router: Router
  ) {}

  // Set CSRF Cookie
  setCookie = () => {
    this.http.get(environment.baseURL + '/sanctum/csrf-cookie', this.httpOptions)
      .subscribe({
        next: () => {},
        error: response => {
          if (response?.status === 401) {
            localStorage.setItem('auth-info', '');
            this.router.navigate(['/unauthorized']);
          }
          this.toastService.show(response.error?.message);
        }
      });
  };

  // Common get request format
  getRequest = (url: string): Observable<any> => {
    return this.http.get(environment.apiURL + url, this.httpOptions);
  };

  // Common post request format
  postRequest = (url: string, data: HttpParams | null = null): Observable<any> => {
    this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const reqData = data ? data.toString() : '';

    return this.http.post(environment.apiURL + url, reqData, this.httpOptions);
  };

  // Common patch request format
  patchRequest = (url: string, data: HttpParams, id: number | null = null): Observable<any> => {
    this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const newUrl = id ? `${url}/${id}` : url;
    const reqData = data ? data.toString() : '';

    return this.http.patch(environment.apiURL + newUrl, reqData, this.httpOptions);
  };

  // Common delete request format
  deleteRequest = (url: string): Observable<any> => {
    return this.http.delete(environment.apiURL + url, this.httpOptions);
  };
}
