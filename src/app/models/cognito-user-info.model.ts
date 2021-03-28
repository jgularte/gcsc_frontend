/* tslint:disable:variable-name */

export class CognitoUserInfoModel {
  public Username: string;
  public UserAttributes: Array<{Name: string, Value: string}>;
  public ResponseMetadata: object;

  constructor(Username: string, UserAttributes: Array<{Name: string, Value: string}>, ResponseMetadata: object) {
   this.Username = Username;
   this.UserAttributes = UserAttributes;
   this.ResponseMetadata = ResponseMetadata;
  }
}
