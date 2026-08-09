import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { providePrimeNG } from "primeng/config";
import { routes } from "./app.routes";
import { provideCrudBuilderConfig } from "./provide-crud-builder-config";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{fuchsia.50}",
      100: "{fuchsia.100}",
      200: "{fuchsia.200}",
      300: "{fuchsia.300}",
      400: "{fuchsia.400}",
      500: "{fuchsia.500}",
      600: "{fuchsia.600}",
      700: "{fuchsia.700}",
      800: "{fuchsia.800}",
      900: "{fuchsia.900}",
      950: "{fuchsia.950}",
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
    }),
    provideCrudBuilderConfig(),
    provideAnimationsAsync(),
  ],
};

registerLocaleData(localeFr, "fr");
