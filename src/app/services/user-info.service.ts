import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserInfoModel} from '../models/user-info.model';

@Injectable({providedIn: 'root'})
export class UserInfoService {

  private userInfo: UserInfoModel[] = [];

  constructor(private http: HttpClient) {
    if (environment.environment === 'local') {
      this.userInfo = require('../../../test/local_data/user-info.json');
    } else {
      console.log('TODO');
    }
  }

  getUserInfo(): UserInfoModel[] {
    return this.userInfo;
  }
}
