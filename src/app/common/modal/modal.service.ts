import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  parseModal = (modalName: any) => {
    const element = document.querySelector(modalName);

    return new bootstrap.Modal(element);
  };

  changeContent = (modalName: any, body: any) => {
    document.querySelector(modalName).querySelector('.modal-body').innerHTML = body;
  };
}
