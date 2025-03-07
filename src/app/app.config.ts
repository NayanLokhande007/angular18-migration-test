import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';  // Assuming you have a separate app.routes.ts file
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),  // Enable hash routing here
    provideHttpClient(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }  // Provide HashLocationStrategy
  ]
};
