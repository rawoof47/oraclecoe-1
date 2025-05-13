import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, HttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: 'TEST_HTTP',
      useFactory: (http: HttpClient) => {
        console.log('✅ HttpClient is working:', !!http); // should show in console
        return true;
      },
      deps: [HttpClient],
    },
  ],
}).catch(err => console.error('❌ BOOTSTRAP FAILED:', err));
