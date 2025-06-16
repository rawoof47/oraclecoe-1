import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { importProvidersFrom } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // 👈 add this
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// ✅ JWT Interceptor
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
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
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    importProvidersFrom(FontAwesomeModule, BrowserAnimationsModule, MatSnackBarModule), // 👈 include snackbar here
    {
      provide: 'TEST_HTTP',
      useFactory: (http: HttpClient) => {
        console.log('✅ HttpClient is working:', !!http);
        return true;
      },
      deps: [HttpClient],
    },
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIconPacks(fas);
        return library;
      }
    }
  ]
}).catch(err => console.error('❌ BOOTSTRAP FAILED:', err));
