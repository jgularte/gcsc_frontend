import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: [
    './calendar.component.css'
  ]
})
export class CalendarComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }
}
