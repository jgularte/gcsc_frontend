import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [
    './auth.component.css'
  ]
})
export class AuthComponent implements OnInit {

  authForm: FormGroup;
  successfulAuthSub = new Subscription();
  failedAuthSub = new Subscription();
  failedAuthWarningMsg = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authForm = new FormGroup({});
  }

  ngOnInit(): void {
    // subscribe to the failed auth subject
    this.failedAuthSub = this.authService.failedAuth
      .subscribe(() => {
        this.failedAuthWarningMsg = true;
      });
    // subscribe to the successful auth subject
    this.successfulAuthSub = this.authService.successfulAuth
      .subscribe(() => {
        this.router.navigate(['/calendar']);
      });
    // init the auth form
    this.authForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(8)])
      }
    );
  }

  onSubmit(): void {
    this.authService.authenticate(this.authForm.value.email, this.authForm.value.password);
  }
}
