import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthService {
  private currentUser: any;
  private apiToken = '';
  private authURL = `${environment.base_url}${environment.endpoints.auth}`;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: this.getAPIToken(),
      }
    )
  };
  // todo remove this
  private cogClientId = '3isa3gbt5oi9j01pos3v0dbqmo';
  private accessToken = null;

  public failedAuth = new Subject();

  constructor(private http: HttpClient) {
    // todo this is temporary until I get to work on the auth page
    this.apiToken = 'f029';
    this.currentUser = 'jack.gularte';
    this.httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: this.getAPIToken(),
        }
      )
    };
  }

  authenticate(email: string, pword: string): void {
    const body = {
      client_id: this.cogClientId,
      username: email,
      password: pword
    };
    this.http.post(this.authURL, body, this.httpOptions)
      .pipe(
        catchError(this.handleError('signIn')),
        tap((data) => {
          this.extractAccessToken(data);
        })
      ).subscribe();
  }

  extractAccessToken(cognitoResponse: any): void {
    if (cognitoResponse.AuthenticationResult.AccessToken) {
      this.accessToken = cognitoResponse.AuthenticationResult.AccessToken;
      console.log('Access Token Retrieved.');
    }
  }

  getAPIToken(): string {
    return this.apiToken;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }

  isCurrentUser(userGuid: string): boolean {
    return userGuid === this.currentUser;
  }

  handleError(operation = 'operation'): any {
    return (error: any) => {
      console.error(`Error in Operation: ${operation}. ERROR: ${JSON.stringify(error)}`);
      this.failedAuth.next();
      return of({AuthenticationResult: {AccessToken: null}});
    };
  }
}
