import { Route } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

export const appRoutes: Route[] = [
  {
    path: '/badee-project-frontend/signin/index.html',
    component: SignInComponent,
  },
  {
    path: '/badee-project-frontend/signup/index.html',
    component: SignUpComponent,
  },
  {
    path: '/badee-project-frontend/profile/index.html',
    component: UserProfileComponent,
  },
  {
    path: '',
    redirectTo: '/badee-project-frontend/signin/index.html',
    pathMatch: 'full',
  },
];
