import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [
    './auth.component.css'
  ]
})
export class AuthComponent implements OnInit {

  authForm: FormGroup;

  constructor(private authService: AuthService) {
    this.authForm = new FormGroup({});
  }

  ngOnInit(): void {
    const email = '';
    const password = '';

    this.authForm = new FormGroup({
        email: new FormControl(email, Validators.required),
        password: new FormControl(password, [Validators.required, Validators.minLength(8)])
      }
    );
  }

  onSubmit(): void {
    this.authService.authenticate(this.authForm.value.username, this.authForm.value.password);
  }
}
