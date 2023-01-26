import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CommentsService {
  constructor(private service: ApiService) {}

  // Comment list API
  list = (url: string = '') => {
    return this.service.getRequest('/reporters/comments' + url);
  };

  // Remove API
  remove = (data: HttpParams, id: number) => {
    return this.service.patchRequest('/reporters/comments', data, id);
  };
}
