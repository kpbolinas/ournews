import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root'
})

export class TooltipService {
  init = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipArr = Array.from(tooltipTriggerList);
    tooltipArr.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  };
}
