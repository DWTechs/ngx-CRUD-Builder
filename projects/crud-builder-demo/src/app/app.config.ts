import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { APP_CONFIG, AppConfig } from "@core/app-config/app-config.token";
import {
  APP_FORM_CONFIG,
  FormTokenData,
} from "@crud/form/utils/form.injection-token";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { routes } from "./app.routes";

const TITLE = "Form Builder";
const APP_KEY = "form_builder";
const AppStorageKey = {
  TABLE_CONFIG: `${APP_KEY}_tableConfig`,
  THEME: `${APP_KEY}_theme`,
  TOKEN: `${APP_KEY}_token`,
  REFRESH_TOKEN: `${APP_KEY}_refreshToken`,
} as const;
const CONFIG: AppConfig = {
  title: TITLE,
  appKey: APP_KEY,
  storageKeys: AppStorageKey,
  apiPrefix: "/",
};

const FORM_CONFIG: FormTokenData = {
  customErrorMessages: {
    unsafeWords: $localize`:@@Validators_UnsafeWords:Le texte contient des mots non autorisés : {words}`,
    minDate: $localize`:@@Validators_MinDate:La date doit être au moins à {days} jour(s) après aujourd'hui`,
  },
};
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{pink.50}",
      100: "{pink.100}",
      200: "{pink.200}",
      300: "{pink.300}",
      400: "{pink.400}",
      500: "{pink.500}",
      600: "{pink.600}",
      700: "{pink.700}",
      800: "{pink.800}",
      900: "{pink.900}",
      950: "{pink.950}",
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
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: "fr" },
    { provide: APP_CONFIG, useValue: CONFIG },
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG },
  ],
};

registerLocaleData(localeFr, "fr");
