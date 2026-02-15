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
import Aura from "@primeuix/themes/aura";
import { MessageService } from "primeng/api";
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
    { provide: LOCALE_ID, useValue: "fr" },
    { provide: APP_CONFIG, useValue: CONFIG },
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG },
  ],
};
