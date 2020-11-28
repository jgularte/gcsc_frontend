import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular';
//import {Auth} from '@aws-amplify/auth';

import { AuthComponent } from '../auth/auth.component';
import { AuthRoutingModule } from './routing-modules/auth-routing.module';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  providers: [
  ]
})
export class AuthModule {}
