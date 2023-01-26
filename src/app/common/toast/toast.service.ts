import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  show = (message = '', bg = 'danger') => {
    const toastElement = document.querySelector('#our-toast');
    const toast = new bootstrap.Toast(toastElement || '');
    const toastBody = document.querySelector('#our-toast-body');
    
    if (toastElement) {
      if (bg !== 'danger') {
        toastElement.classList.remove('text-bg-danger');
        toastElement.classList.add('text-bg-' + bg);
      }
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.className = 'toast text-bg-danger';
      });
    }

    if (toastBody) {
      toastBody.innerHTML = message;
    }

    toast.show();
  };
}
