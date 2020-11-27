import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { CalendarPageComponent } from '../calendar/calendar-page.component';
import { CalendarPageRoutingModule } from './routing-modules/calendar-page-routing.module';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [
    CalendarPageComponent
  ],
  imports: [
    ReactiveFormsModule,
    CalendarPageRoutingModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    FormsModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    NgbModalModule
  ]
})
export class CalendarPageModule {}
