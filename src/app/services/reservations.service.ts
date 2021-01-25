import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ReservationsModel} from '../models/reservations.model';
import {environment} from '../../environments/environment';
import {CalendarEvent} from 'angular-calendar';
import {addDays, addHours, endOfMonth, startOfDay, subDays} from 'date-fns';
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class ReservationsService implements OnInit {

  private reservations: ReservationsModel[] = [];
  private url: string = `${environment.base_url}${environment.endpoints.reservations}`;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {}

  getReservations(){
    return this.http.get(this.url)
  }

  createReservation(reservation: ReservationsModel) {
    // todo create reservations in dynamo
    console.log('[ReservationsService] TODO Create Reservation');
  }

  deleteReservation(reservation_id: number) {
    // todo delete reservations in dynamo
    console.log('[ReservationsService] TODO Delete Reservation')
  }

}
