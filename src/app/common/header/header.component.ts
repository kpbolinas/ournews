import { Component } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  header = '';

  events;

  constructor(private router: Router) {
    this.setHeader(router.url);

    this.events = this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          this.setHeader(event.url);
        }
      }
    );
  }

  setHeader = (url: string) => {
    switch (url) {
      case '/unpublished':
        this.header = 'UNPUBLISHED';
        break;
    
      case '/published':
        this.header = 'PUBLISHED';
        break;

      case '/profile':
        this.header = 'PROFILE';
        break;
    
      default:
        this.header = 'OUR NEWS';
        break;
    }
  };

  ngOnDestroy() {
    this.events.unsubscribe();
  }
}
