import {Injectable} from '@angular/core';
import {ReservationsModel} from '../models/reservations.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ReservationsService {
  public reservationsChanges = new Subject<ReservationsModel[]>();
  private reservations: ReservationsModel[] = [];

  constructor() {}

  getReservations(): ReservationsModel[] {
    return this.reservations.slice();
  }

  setReservations(reservations: ReservationsModel[]): void {
    this.reservations = reservations;
    this.reservationsChanges.next(this.reservations.slice());
  }

  validateReservation(reservation: ReservationsModel): boolean {
    // todo validation
    return true;
  }
}
