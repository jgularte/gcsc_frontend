import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ReservationsModel} from '../models/reservations.model';
import {environment} from '../../environments/environment';
import {CalendarEvent} from 'angular-calendar';
import {addDays, addHours, endOfMonth, startOfDay, subDays} from 'date-fns';

@Injectable({providedIn: 'root'})
export class ReservationsService {
  // prodEvents: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  private reservations: ReservationsModel[] = [];

  constructor(private http: HttpClient) {
    if (environment.environment === 'local') {
      this.reservations = require('../../../test/local_data/reservations.json');
    } else {
      console.log('TODO fdgfdsa');
    }
  }

  getReservations(): ReservationsModel[] {
    return this.reservations;
  }

}
