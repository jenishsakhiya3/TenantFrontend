import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Tenant Frontend';
  authToken: string | null = null;
  userEmail: string | null = null;
  
  validateResponse: any = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 1. Capture token from the URL hash sent by redirectToApp()
    this.handleIncomingMsalToken();

    // 2. Validate token against the backend API
    this.validateToken();
  }

  handleIncomingMsalToken(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');
      // Prioritize id_token (contains user identity for custom backend)
      const token = idToken || params.get('token') || accessToken;
      const user = params.get('user');

      if (token) {
        sessionStorage.setItem('auth_token', token);
        if (user) {
          sessionStorage.setItem('user_email', user);
        }

        // Clean up URL hash so token isn't visible in the browser address bar
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        console.log('Successfully captured token for user:', user);
      }
    }

    this.authToken = sessionStorage.getItem('auth_token');
    this.userEmail = sessionStorage.getItem('user_email');
  }

  validateToken(): void {
    if (!this.authToken) {
      console.warn('No token found to validate.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.http.get('https://sportapi1-erhuehfwa7bpghd3.eastasia-01.azurewebsites.net/api/auth/validate', { headers })
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.validateResponse = data;
          console.log('Token validated successfully:', data);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.statusText || 'Validation request failed';
          console.error('Validation Error:', err);
        }
      });
  }
}
