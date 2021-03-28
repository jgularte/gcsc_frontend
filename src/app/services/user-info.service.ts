import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserInfoModel} from '../models/user-info.model';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, pluck, tap} from 'rxjs/operators';
import {CognitoUserInfoModel} from '../models/cognito-user-info.model';

@Injectable({providedIn: 'root'})
export class UserInfoService {
  // rest
  private apiToken = 'f029';
  private authURL = `${environment.base_url}${environment.endpoints.auth}`;
  private userInfoURL = `${environment.base_url}${environment.endpoints.user_info}`;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: this.apiToken,
      }
    ),
    params: new HttpParams()
  };
  // current user
  public currentUserCognitoInfo: CognitoUserInfoModel;
  public currentUserDisplayName: string;
  private successfulAuthSub = new Subscription();
  public userInfoChanges = new Subject();
  // all users
  constructor(private http: HttpClient, private authService: AuthService) {
    this.currentUserCognitoInfo = new CognitoUserInfoModel('', [], {});
    this.currentUserDisplayName = '';
    // subscribe to a successful authentication result and get the user's cognito profile using the access_token gained from auth.
    this.successfulAuthSub = this.authService.successfulAuth
      .subscribe((accessToken: string) => {
        this.getCurrentUserCognitoInfoFromAT(accessToken);
      });
  }

  getCurrentUserCognitoInfoFromAT(accessToken: string): void {
    this.httpOptions.params = new HttpParams({fromObject: {at: accessToken}});
    this.http.get(this.authURL, this.httpOptions)
      .pipe(
        catchError(this.handleError('getCognitoUserInfo', {AuthenticationResult: {AccessToken: null}})),
        tap((userCognitoProfile: CognitoUserInfoModel) => {
          this.currentUserCognitoInfo = userCognitoProfile;
          this.currentUserDisplayName = this.currentUserCognitoInfo.UserAttributes
            .filter((user: { Name: string; Value: string}) => user.Name === 'name')[0].Value;
          this.userInfoChanges.next(this.currentUserCognitoInfo);
        })
      ).subscribe();
  }

  async getUserDynamoInfo(userGuid: string): Promise<any> {
    // todo check cache
    this.httpOptions.params = new HttpParams({fromObject: {uguid: userGuid}});
    return this.http.get(this.userInfoURL, this.httpOptions)
      .pipe(
        catchError(this.handleError('getDynamoUserInfo', {data: {primary_color: '', secondary_color: '', user_guid: ''}})),
        pluck('data'),
        tap((data) => {
          // todo cache results
        })
      ).toPromise();
  }

  handleError(operation = 'operation', retObj: any): any {
    return (error: any) => {
      console.error(`Error in Operation: ${operation}. ERROR: ${JSON.stringify(error)}`);
      return of(retObj);
    };
  }
}
