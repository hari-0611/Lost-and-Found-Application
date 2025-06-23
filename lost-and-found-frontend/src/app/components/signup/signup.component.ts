import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupData = {
    username: '',
    email: '',
    password: '',
    phone_number: '',
    full_name: '',
    address: '',
  };

  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    // basic field check
    if (
      !this.signupData.username ||
      !this.signupData.email ||
      !this.signupData.password ||
      !this.signupData.phone_number ||
      !this.signupData.full_name ||
      !this.signupData.address
    ) {
      this.message = 'Please fill in all fields';
      return;
    }

    this.authService.signup(this.signupData).subscribe(
      (res) => {
        this.message = res.message;
        if (res.message.includes('success')) {
          this.router.navigate(['/login']);
        }
      },
      (err) => {
        this.message = err.error.message || 'Signup failed. Please try again.';
      }
    );
  }
}
