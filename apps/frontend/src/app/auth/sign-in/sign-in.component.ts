import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { signIn } from '../../store/auth.actions';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  errorMessage = '';
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store // ✅ FIXED: added store
  ) {}

  ngOnInit() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    // ✅ Dispatch the signIn action with form data
    this.store.dispatch(signIn({ signInData: this.signInForm.value }));
    this.errorMessage = '';
  }
}
