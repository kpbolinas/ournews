import { Component } from '@angular/core';
import { ApiService } from './api/api.service';
import { AppSettings } from './app.setting';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = AppSettings.APP_TITLE;

  constructor(private service: ApiService) {
    // Set API XSRF Token
    this.service.setCookie();
  }
}
