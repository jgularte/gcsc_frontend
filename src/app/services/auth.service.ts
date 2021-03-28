import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthService {
  private currentUser: any;
  private apiToken = 'f029';
  private authURL = `${environment.base_url}${environment.endpoints.auth}`;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        Authorization: 'f029',
      }
    )
  };
  // todo remove this
  private cogClientId = '59alfspomjihv7js74ba2sjbor';
  private accessToken: string | undefined;

  // subjects
  public successfulAuth = new Subject<string>();
  public failedAuth = new Subject();

  // state
  public loggedIn = false;

  constructor(private http: HttpClient) {}

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
          if (data.AuthenticationResult.AccessToken) {
            console.log('Access token retrieved from AWS Cognito User Pool.');
            this.accessToken = data.AuthenticationResult.AccessToken;
            this.loggedIn = true;
            this.successfulAuth.next(this.accessToken);
          }
        })
      ).subscribe();
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
