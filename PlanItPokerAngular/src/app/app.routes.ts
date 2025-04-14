import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/rooms/landing-page/landing-page.component';
import { VotingPageComponent } from './modules/voting/voting-page/voting-page.component';
import { ProfilePageComponent } from './modules/profile/profile-page/profile-page.component';
import { AuthPageComponent } from './modules/auth/auth-page/auth-page.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignUpComponent } from './modules/auth/sign-up/signup.component';
import { QuickPlayComponent } from './modules/auth/quick-play/quick-play.component';
import { alreadyLoggedInGuard } from './core/guards/already-loggedin.guard';
import { authGuard } from './core/guards/auth.guard';
import { JoinRoomComponent } from './modules/rooms/join-room/join-room.component';


export const routes: Routes = [
  { 
    path: '', 
    component: LandingPageComponent 
  },
  { 
    path: 'vot/:roomId', 
    component: VotingPageComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: ProfilePageComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [alreadyLoggedInGuard] 
  },
  { 
    path: 'signup', 
    component: SignUpComponent,
    canActivate: [alreadyLoggedInGuard] 
  },
  { 
    path: 'quickplay', 
    component: QuickPlayComponent,
    canActivate: [alreadyLoggedInGuard] 
  },
  { 
    path: 'room/:id',
    component: JoinRoomComponent,
    canActivate: [alreadyLoggedInGuard] 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
