import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import Aura from '@primeuix/themes/aura';

// Importação do HttpClient 
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    
    //  Provedor HTTP  
    [provideRouter(routes), provideHttpClient()],
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
            darkModeSelector: '.app-dark' // Trava o tema claro!
             }
            }
        })
        
  ]
};