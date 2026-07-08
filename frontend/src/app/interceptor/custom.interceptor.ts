import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStr = localStorage.getItem('userApp');
  if (tokenStr) {
    try {
      const tokenObj = JSON.parse(tokenStr);
      const token = tokenObj.token;
      if (token) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(clonedReq);
      }
    } catch (e) {
      console.error("Error parsing token from localStorage", e);
    }
  }
  return next(req);
};
