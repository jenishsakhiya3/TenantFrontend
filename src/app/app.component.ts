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
  title = 'tenant-frontend';
  posts: any[] = [];
  authToken: string | null = null;
  userEmail: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 1. Capture token from URL or session storage
    this.handleIncomingMsalToken();

    // 2. Call API with the token attached
    this.loadPosts();
  }

  handleIncomingMsalToken(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');
      const token = params.get('token') || idToken || accessToken;
      const user = params.get('user');

      if (token) {
        sessionStorage.setItem('auth_token', token);
        if (user) {
          sessionStorage.setItem('user_email', user);
        }

        // Clean up URL hash so token isn't visible
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        console.log('Successfully captured MSAL token for user:', user);
      }
    }

    this.authToken = sessionStorage.getItem('auth_token');
    this.userEmail = sessionStorage.getItem('user_email');
  }

  loadPosts(): void {
    // 3. Attach Bearer token to request headers if present
    const headers = this.authToken
      ? new HttpHeaders({ Authorization: `Bearer ${this.authToken}` })
      : undefined;

    this.http.get('https://jsonplaceholder.typicode.com/posts', { headers })
      .subscribe((data: any) => {
        this.posts = data.slice(0, 10);
      });
  }
}
