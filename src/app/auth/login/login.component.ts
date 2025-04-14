// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Add authentication logic here
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgotPassword(): void {
    console.log('Forgot password clicked');
    // Add forgot password logic
  }

  signInWithGoogle(): void {
    console.log('Sign in with Google clicked');
    // Add Google sign-in logic
  }

  signInWithFacebook(): void {
    console.log('Sign in with Facebook clicked');
    // Add Facebook sign-in logic
  }

  goToSignUp(): void {
    console.log('Sign up clicked');
    // Add navigation to sign up page
  }
}