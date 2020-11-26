import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from '../auth/auth.component';
import { AuthRoutingModule } from './routing-modules/auth-routing.module';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
