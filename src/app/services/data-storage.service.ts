import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReservationsService} from './reservations.service';
import {AuthService} from './auth.service';
import {catchError, map, pluck, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ReservationsModel} from '../models/reservations.model';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  private reservationsUrl = `${environment.base_url}${environment.endpoints.reservations}`;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'f029',
      }
    )
  };

  constructor(private http: HttpClient,
              private reservationsService: ReservationsService,
              private auth: AuthService) {
  }

  // RESERVATIONS
  // fetch reservations
  fetchReservations(): Observable<ReservationsModel[]> {
    return this.http.get<ReservationsModel[]>(this.reservationsUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<ReservationsModel[]>('getReservations', [])),
        pluck('data'),
        tap((reservations: ReservationsModel[]) => {
          return this.reservationsService.setReservations(reservations);
        })
      );
  }

  // storeReservation
  storeReservation(reservation: ReservationsModel): void {
    this.http.post(this.reservationsUrl, reservation, this.httpOptions)
      .pipe(
        catchError(this.handleError<object>('postReservation', [])),
        tap(() => {
          this.fetchReservations().subscribe();
        })
      )
      .subscribe();
  }

  // updateReservation
  // todo

  // deleteReservation
  deleteReservation(reservation: ReservationsModel): void {
    const qps = `?guid=${reservation.reservation_guid}`;
    const url = this.reservationsUrl + qps;
    this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<object>('deleteReservation', [])),
        tap(() => {
          this.fetchReservations().subscribe();
        })
      )
      .subscribe();
  }

  // USER INFO
  // HELPERS
  /**
   * Todo move this to a service and improve with a logging service.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      console.error(`Error in Operation: ${operation}. Data not updated. ERROR: ${JSON.stringify(error)}`);
      return of(result as T);
    };
  }
}
