import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{Neutral.50}',
      100: '{Neutral.100}',
      200: '{Neutral.200}',
      300: '{Neutral.300}',
      400: '{Neutral.400}',
      500: '{Neutral.500}',
      600: '{Neutral.600}',
      700: '{Neutral.700}',
      800: '{Neutral.800}',
      900: '{Neutral.900}',
      950: '{Neutral.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
    }),
  ],
};
