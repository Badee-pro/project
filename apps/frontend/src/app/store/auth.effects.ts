import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap(({ signUpData }) =>
        this.authService.signUp(signUpData).pipe(
          map((response) =>
            AuthActions.signUpSuccess({ message: response.message })
          ),
          catchError((error) =>
            of(
              AuthActions.signUpFailure({
                error: error.error.message || 'Sign up failed',
              })
            )
          )
        )
      )
    )
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({ signInData }) =>
        this.authService.signIn(signInData).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              message: response.message, // string
              token: response.data.accessToken, // string
              user: response.data.user,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.signInFailure({
                error: error.error.message || 'Sign in failed',
              })
            )
          )
        )
      )
    )
  );
}
