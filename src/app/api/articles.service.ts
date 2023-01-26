import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ArticlesService {
  constructor(private service: ApiService) {}

  // Unpublished API
  unpublished = (url: string = '') => {
    return this.service.getRequest('/reporters/articles/unpublished' + url);
  };

  // Published API
  published = (url: string = '') => {
    return this.service.getRequest('/reporters/articles/published' + url);
  };

  // Detail API
  detail = (id: number) => {
    return this.service.getRequest('/reporters/articles/' + id);
  };

  // Create or Update API
  compose = (data: HttpParams, id: number | null = null) => {
    if (!id) {
      return this.service.postRequest('/reporters/articles', data);
    } else {
      return this.service.patchRequest('/reporters/articles', data, id);
    }
  };

  // Discard or Delete API
  discard = (id: number) => {
    return this.service.deleteRequest('/reporters/articles/' + id);
  };
}
