import { Component } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  currentRoute = '';

  events;

  constructor(private router: Router) {
    this.currentRoute = router.url;

    this.events = this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          this.currentRoute = event.url;
        }
      }
    );
  }

  ngOnDestroy() {
    this.events.unsubscribe();
  }
}
