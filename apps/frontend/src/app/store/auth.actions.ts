import { createAction, props } from '@ngrx/store';

export const signUp = createAction(
  '[Auth] Sign Up',
  props<{ signUpData: { fullName: string; email: string; password: string } }>()
);

export const signUpSuccess = createAction(
  '[Auth] Sign Up Success',
  props<{ message: string }>()
);

export const signUpFailure = createAction(
  '[Auth] Sign Up Failure',
  props<{ error: string }>()
);

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ signInData: { email: string; password: string } }>()
);

export const signInSuccess = createAction(
  '[Auth] Sign In Success',
  props<{
    message: string;
    token: string;
    user: { fullName: string; email: string };
  }>()
);

export const signInFailure = createAction(
  '[Auth] Sign In Failure',
  props<{ error: string }>()
);
