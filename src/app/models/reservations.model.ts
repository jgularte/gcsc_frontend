/* tslint:disable:variable-name */

export class ReservationsModel {
  public reservation_guid: string;
  public user_guid: string;
  public epoch_start: number;
  public epoch_end: number;
  public reservation_type: string;

  constructor(reservation_guid: string, user_guid: string, epoch_start: number, epoch_end: number, reservation_type: string) {
    this.reservation_guid = reservation_guid;
    this.user_guid = user_guid;
    this.epoch_start = epoch_start;
    this.epoch_end = epoch_end;
    this.reservation_type = reservation_type;
  }
}
