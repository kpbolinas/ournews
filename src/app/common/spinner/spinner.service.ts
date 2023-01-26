import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SpinnerService {
  spinner = document.querySelector('#spinner-container');

  show = () => {
    if (this.spinner) {
      this.spinner.classList.add('display-spinner');
    }
  };

  hide = () => {
    if (this.spinner) {
      this.spinner.classList.remove('display-spinner');
    }
  };
}
