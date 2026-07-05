import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { ACL_ADAPTER } from "@crud/core/utils/crud-service/acl-adapter";
import {
  FormFieldAdapterType,
  provideFormFieldRenderer,
} from "@crud/form/ui/field-renderer/provide-form-field-renderer";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG } from "primeng/config";
import { routes } from "./app.routes";
import { AclService } from "./full-example/data-access/acl.service";
import { provideAppConfig } from "./provide-app-config";

export const ADAPTER_STORAGE_KEY = "form_builder_adapter";

const adapter = localStorage.getItem(ADAPTER_STORAGE_KEY) ?? "primeng";
console.log("Using form adapter:", adapter);

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
    { provide: ACL_ADAPTER, useExisting: AclService },
    provideFormFieldRenderer(adapter as FormFieldAdapterType),
    provideAppConfig(),
  ],
};

registerLocaleData(localeFr, "fr");
