import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenStr = localStorage.getItem('userApp');
  let clonedReq = req;

  if (tokenStr) {
    try {
      const tokenObj = JSON.parse(tokenStr);
      const token = tokenObj.token;
      if (token) {
        clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.error("Error parsing token from localStorage", e);
    }
  }

  return next(clonedReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 || error.status === 403) {
          authService.DeleteToken();
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => error);
    })
  );
};
