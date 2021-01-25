import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ReservationsModel} from '../models/reservations.model';
import {environment} from '../../environments/environment';
import {AuthService} from "./auth.service";
import {CalendarEvent} from 'angular-calendar';
import {addDays, addHours, endOfMonth, startOfDay, subDays} from 'date-fns';
import {Observable, of} from "rxjs";
import {catchError, pluck } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class ReservationsService {

  private reservations: ReservationsModel[] = [];
  private url: string = `${environment.base_url}${environment.endpoints.reservations}`;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': this.auth.getAPIToken(),
      }
    )
  }

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getReservations(): Observable<ReservationsModel[]> {
    // todo add a 'cache' pipe and then before reaching out to aws check the cache
    return this.http.get<ReservationsModel[]>(this.url, this.httpOptions)
      .pipe(
        catchError(this.handleError<ReservationsModel[]>('getReservations', [])),
        pluck('data')
      )
  }

  createReservation(reservation: ReservationsModel) {
    // todo validation
    return this.http.post(this.url, reservation, this.httpOptions)
      .pipe(
        catchError(this.handleError<object>('postReservation', {})),
        pluck('message')
      )
  }

  deleteReservation(reservation_id: number) {
    // todo delete reservations in dynamo
    console.log('[ReservationsService] TODO Delete Reservation')
  }

  /**
   * Todo move this to a service and improve with a logging service.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(`Error in Operation: ${operation}, ${JSON.stringify(error)}`);
      return of(result as T);
    }
  }
}
