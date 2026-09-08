import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Tenant Frontend';
  accessToken: string | null = null;
  authToken: string | null = null;
  IdToken: string | null = null;
  userEmail: string | null = null;

  validateResponse: any = null;
  errorMessage: string | null = null;
  isLoading = false;

  // UI display helpers
  showTokenPreview = false;
  backendUrl: string = environment.backendUrl;
  apiStatusCode: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 1. Capture token from the URL hash sent by redirectToApp()
    this.handleIncomingMsalToken();

    // 2. Validate token against the backend API
    this.validateAccessToken();
    //this.validateIdToken();
  }

  handleIncomingMsalToken(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const idToken = params.get('id_token') ?? '';
      const accessToken = params.get('access_token') ?? '';
      const user = params.get('user');

      if (idToken || accessToken) {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('id_token', idToken);

        if (user) {
          sessionStorage.setItem('user_email', user);
        }

        // Clean up URL hash so token isn't visible in the browser address bar
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        console.log('Successfully captured token for user:', user);
      }
    }

    this.accessToken = sessionStorage.getItem('access_token');
    this.IdToken = sessionStorage.getItem('id_token');
    this.userEmail = sessionStorage.getItem('user_email');
  }

  validateAccessToken(): void {
    if (!this.accessToken) {
      console.warn('No token found to validate.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.apiStatusCode = null;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    this.http.get(`${environment.backendUrl}`, { headers, observe: 'response' })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.apiStatusCode = response.status;
          this.validateResponse = response.body;
          console.log('Token validated successfully:', response.body);
        },
        error: (err) => {
          this.isLoading = false;
          this.apiStatusCode = err.status || null;
          this.errorMessage = err.error?.message || err.statusText || 'Validation request failed';
          console.error('Validation Error:', err);
        }
      });
  }
  // validateIdToken(): void {
  //   if (!this.IdToken) {
  //     console.warn('No token found to validate.');
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.errorMessage = null;

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.IdToken}`
  //   });

  //   this.http.get(`${environment.backendUrl}/api/auth/validate`, { headers })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.isLoading = false;
  //         this.validateResponse = data;
  //         console.log('Token validated successfully:', data);
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.errorMessage = err.error?.message || err.statusText || 'Validation request failed';
  //         console.error('Validation Error:', err);
  //       }
  //     });
  // }
}
