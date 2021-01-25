import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class AuthService {
  private currentUser: any;
  private api_token: string = "";

  constructor() {
    // todo this is temporary until I get to work on the auth page
    this.api_token = "gobengals";
    this.currentUser = "jack.gularte";
  }

  authenticate(username: string, password: string): void {

  }

  getAPIToken(): string {
    return this.api_token;
  }

  getCurrentUser(): string {
    return this.currentUser;
  }
}
