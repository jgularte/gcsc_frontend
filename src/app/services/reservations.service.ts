import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ReservationsModel} from '../models/reservations.model';
import {environment} from '../../environments/environment';
import {CalendarEvent} from 'angular-calendar';
import {addDays, addHours, endOfMonth, startOfDay, subDays} from 'date-fns';

@Injectable({providedIn: 'root'})
export class ReservationsService {

  private reservations: ReservationsModel[] = [];

  constructor(private http: HttpClient) {
    if (environment.environment === 'local_w_mock') {
      console.log('getting local reservations with current times.')
      this.reservations = require('../../../test/local_data/reservations.json');
      // for res_0, will do current_time-5days to current_time-2days;
      this.reservations[0].epoch_start = subDays(new Date(), 5).getTime() / 1000
      this.reservations[0].epoch_end = subDays(new Date(), 2).getTime() / 1000
      // for res_1 will do current_time-2days to current_time+4days;
      this.reservations[1].epoch_start = subDays(new Date(), 2).getTime() / 1000
      this.reservations[1].epoch_end = addDays(new Date(), 4).getTime() / 1000
      // for res_2 will do current_time+1day to current_time+10days;
      this.reservations[2].epoch_start = addDays(new Date(), 1).getTime() / 1000
      this.reservations[2].epoch_end = addDays(new Date(), 10).getTime() / 1000
    } else if (environment.environment === 'local'){
      // todo handle other environments
      console.log('TODO Handle Other Environments');
    }
  }

  getReservations(): ReservationsModel[] {
    return this.reservations;
  }

  createReservation(reservation: ReservationsModel) {
    // todo create reservations in dynamo
    console.log('TODO Create Reservation');
  }

  deleteReservation(reservation_id: number) {
    // todo delete reservations in dynamo
    console.log('TODO Delete Reservation')
  }

}
