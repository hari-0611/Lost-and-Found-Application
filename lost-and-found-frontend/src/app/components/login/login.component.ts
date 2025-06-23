import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.message = 'Please enter email and password';
      return;
    }

    this.authService.login(this.loginData).subscribe(
      res => {
        this.message = res.message;
        if (res.token) {
          this.authService.saveToken(res.token);
          this.authService.saveUser(res.user);
          this.router.navigate(['/dashboard']);
        }
      },
      err => {
        this.message = err.error.message || 'Login failed. Please try again.';
      }
    );
  }
}
