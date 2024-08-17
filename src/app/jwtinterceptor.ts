import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponentComponent } from './session-expired-dialog-component/session-expired-dialog-component.component';

@Injectable()
export class Jwtinterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');

    if (token) {
      token = token.replace(/^"|"$/g, '');

      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          this.showSessionExpiredPopup();
          localStorage.removeItem('token');
          return throwError(() => new Error('Token expired'));
        }

        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

      } catch (error) {
        this.showSessionExpiredPopup();
        localStorage.removeItem('token');
        return throwError(() => new Error('Invalid token'));
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  private showSessionExpiredPopup() {
    this.dialog.open(SessionExpiredDialogComponentComponent, {
      width: '250px',
      data: { message: 'Your session has expired. Please log in again.' }
    });
  }
}
