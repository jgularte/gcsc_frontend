/* tslint:disable:variable-name */

export class UserInfoModel {
  public user_guid: string;
  public primary_color: string;
  public secondary_color: string;

  constructor(user_guid: string, primary_color: string, secondary_color: string) {
    this.user_guid = user_guid;
    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
  }
}
