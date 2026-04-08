import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { APP_CONFIG, AppConfig } from "@core/app-config/app-config.token";
import { HISTORY_MAPPER } from "@crud/core/ui/history/history-mapper.token";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import { ACL_ADAPTER } from "@crud/core/utils/crud-service/acl-adapter";
import {
  APP_FORM_CONFIG,
  FormTokenData,
} from "@crud/form/utils/form.injection-token";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { routes } from "./app.routes";
import { AclService } from "./full-example/data-access/acl.service";
import { RawHistoryRow } from "./table-demo/table-demo-mock.service";

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
    MessageService,
    ConfirmationService,
    { provide: LOCALE_ID, useValue: "fr" },
    { provide: APP_CONFIG, useValue: CONFIG },
    { provide: ACL_ADAPTER, useExisting: AclService },
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG },
    {
      provide: HISTORY_MAPPER,
      useValue: (raw: unknown): HistorizedData<unknown> => {
        const r = raw as RawHistoryRow<unknown>;
        return {
          tstamp: r.timestamp,
          operation: r.action,
          updaterId: r.consumerId,
          updaterName: r.consumerName,
          val: r.data,
          table_name: "users",
        };
      },
    },
  ],
};

registerLocaleData(localeFr, "fr");
