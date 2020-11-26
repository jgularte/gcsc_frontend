import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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

  constructor(private router: Router) {
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
    console.log('submit');
  }
}
