import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/authenticate', pathMatch: 'full'},
  {path: 'authenticate', loadChildren: () => import('./modules/auth.module').then(module => module.AuthModule)},
  {path: 'calendar', loadChildren: () => import('./modules/calendar-page.module').then(module => module.CalendarPageModule)},
  {path: '**', redirectTo: '/calendar'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
