/* tslint:disable:variable-name */

export class ReservationsModel {
  public reservation_guid: string;
  public user_guid: string;
  public epoch_start: number;
  public epoch_end: number;
  public display_name: string;

  constructor(reservation_guid: string, user_guid: string, epoch_start: number, epoch_end: number, display_name: string) {
    this.reservation_guid = reservation_guid;
    this.user_guid = user_guid;
    this.epoch_start = epoch_start;
    this.epoch_end = epoch_end;
    this.display_name = display_name;
  }
}
