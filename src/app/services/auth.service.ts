import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
// import {AmplifyService} from 'aws-amplify-angular';

@Injectable({providedIn: 'root'})
export class AuthService {
  currentUser: any;

  constructor() {
    console.log(environment.environment);
  }

  authenticate(username: string, password: string): void {
    console.log('jdklafd');
    // try {
    //   this.currentUser = Auth.signIn(username, password);
    //   console.log(this.currentUser);
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
