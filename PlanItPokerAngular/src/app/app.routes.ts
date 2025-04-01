import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/rooms/landing-page/landing-page.component';
import { VotingPageComponent } from './modules/voting/voting-page/voting-page.component';
import { ProfilePageComponent } from './modules/profile/profile-page/profile-page.component';
import { AuthPageComponent } from './modules/auth/auth-page/auth-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'vot/:roomId', component: VotingPageComponent },
    { path: 'profile', component: ProfilePageComponent },
    { path: 'login', component: AuthPageComponent },
  ];
