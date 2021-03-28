import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    './navbar.component.css'
  ]
})
export class NavbarComponent implements OnInit {
  navStyle = 'opaqueOverlay';

  constructor(private router: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/authenticate') {
          this.navStyle = 'opaqueOverlay';
        } else {
          this.navStyle = 'standardHeader';
        }
      }
    });
  }
}
