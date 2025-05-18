import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ Use function-based interceptor (Angular 16+ compatible way)
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideAnimations(), // ✅ Required for Angular Material animations
    {
      provide: 'TEST_HTTP',
      useFactory: (http: HttpClient) => {
        console.log('✅ HttpClient is working:', !!http);
        return true;
      },
      deps: [HttpClient],
    },
  ],
}).catch(err => console.error('❌ BOOTSTRAP FAILED:', err));
