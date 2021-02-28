import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserInfoModel} from '../models/user-info.model';

@Injectable({providedIn: 'root'})
export class UserInfoService {

  private userInfo: UserInfoModel[] = [];

  constructor(private http: HttpClient) {
    this.userInfo = require('../../../test/mock_data/user-info.json');
  }

  getUserInfo(userGuid: string): UserInfoModel {
    return this.userInfo.filter(user => user.user_guid === userGuid)[0];
  }
}
