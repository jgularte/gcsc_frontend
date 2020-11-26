import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarRoutingModule } from './routing-modules/calendar-routing.module';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    ReactiveFormsModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule {}
