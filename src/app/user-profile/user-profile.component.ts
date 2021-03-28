import { Component, OnInit } from '@angular/core';
import {UserInfoService} from '../services/user-info.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  // user info subscription
  private userInfoSub = new Subscription();
  // misc
  public greetingName = '';
  constructor(public userInfoService: UserInfoService) {}

  ngOnInit(): void {
    this.userInfoSub = this.userInfoService.userInfoChanges
      .subscribe((cognitoUserInfo: any) => {
        this.initUserProfileForm(cognitoUserInfo);
      });
  }

  initUserProfileForm(cognitoUserInfo: any): void {
    // todo, the rest of this
    for (const att of cognitoUserInfo['UserAttributes']) {
      switch (att.Name) {
        case 'name':
          this.greetingName = att.Value;
          break;
      }
    }
  }
}
