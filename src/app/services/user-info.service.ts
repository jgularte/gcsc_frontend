import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserInfoModel} from '../models/user-info.model';

@Injectable({providedIn: 'root'})
export class UserInfoService {

  private userInfo: UserInfoModel[] = [];

  constructor(private http: HttpClient) {
    if (environment.environment === 'mock') {
      this.userInfo = require('../../../test/mock_data/user-info.json');
    } else {
      // todo handle all other environments
      // todo create a user_info dynamo table
      console.log('[AuthService] TODO Handle Other Environments');
    }
  }

  getUserInfo(user_guid: string): UserInfoModel {
    return this.userInfo.filter(user => user.user_guid === user_guid)[0]
  }
}
