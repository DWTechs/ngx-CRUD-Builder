import { LOCALE_ID, makeEnvironmentProviders } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { APP_CONFIG, AppConfig } from "@core/app-config/app-config.token";
import { HISTORY_MAPPER } from "@crud/core/ui/history/history-mapper.token";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import { ACL_ADAPTER } from "@crud/core/utils/crud-service/acl-adapter";
import { provideCrudLabels } from "@crud/core/utils/i18n/crud-labels.token";
import {
  FormFieldAdapterType,
  provideFormFieldRenderer,
} from "@crud/form/ui/field-renderer/provide-form-field-renderer";
import {
  APP_FORM_CONFIG,
  FormTokenData,
} from "@crud/form/utils/form.injection-token";
import { provideTableRenderer } from "@crud/table/ui/table-renderer/provide-table-renderer";
import { CRUD_LABELS_CONFIG } from "./crud-labels-en";
import { AclService } from "./full-example/data-access/acl.service";
import { PrimeNgTranslationsEn } from "./primeng-translations-en";
import { RawHistoryRow } from "./table-demo/table-demo-mock.service";

const FORM_CONFIG: FormTokenData = {
  customErrorMessages: {
    unsafeWords: $localize`:@@Validators_UnsafeWords:Le texte contient des mots non autorisés : {words}`,
    minDate: $localize`:@@Validators_MinDate:La date doit être au moins à {days} jour(s) après aujourd'hui`,
  },
};
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

// single adapter for the whole demo: form and table always use the same UI kit, no mixing
export const ADAPTER_STORAGE_KEY = "crud_builder_adapter";

const adapter = (localStorage.getItem(ADAPTER_STORAGE_KEY) ??
  "primeng") as FormFieldAdapterType;
console.log("Using adapter:", adapter);

export function provideCrudBuilderConfig() {
  return makeEnvironmentProviders([
    { provide: LOCALE_ID, useValue: "fr" },
    { provide: APP_CONFIG, useValue: CONFIG },
    provideCrudLabels(CRUD_LABELS_CONFIG, PrimeNgTranslationsEn),
    { provide: APP_FORM_CONFIG, useValue: FORM_CONFIG }, // remove if no @form
    {
      provide: HISTORY_MAPPER,
      useValue: (raw: unknown): HistorizedData<unknown> => {
        const r = raw as RawHistoryRow<unknown>;
        return {
          id: r.id,
          tstamp: r.tstamp,
          operation: r.operation,
          updaterId: r.updaterId,
          updaterName: r.updaterName,
          record: r.record,
        };
      },
    },
    { provide: ACL_ADAPTER, useExisting: AclService },
    // table shell only exists for primeng/material; native reproduces the
    // "no table available" error for the adapter switcher demo
    ...(adapter === "primeng" || adapter === "material"
      ? provideTableRenderer(adapter)
      : []),
    provideFormFieldRenderer(adapter),
    provideNativeDateAdapter(),
  ]);
}
