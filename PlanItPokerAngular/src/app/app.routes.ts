import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/rooms/landing-page/landing-page.component';
import { VotingPageComponent } from './modules/voting/voting-page/voting-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'vot', component: VotingPageComponent },
  ];
