import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CalendarPageComponent } from '../../calendar/calendar-page.component';


const routes: Routes = [
  { path: '', component: CalendarPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CalendarPageRoutingModule {}
