// --- Core: app config token (required by host app) ---
export * from "./core/app-config/app-config.token";
export * from "./core/utils/loading/loading.service";
// --- Core: utilities ---
export * from "./core/utils/local-storage/local-storage.service";
export * from "./core/utils/primeng/primeng-translations";
export * from "./core/utils/primeng/to-select-items";
export * from "./core/utils/snackbar/snackbar.service";
export * from "./core/utils/strings/strings.utils";

// --- CRUD: models ---
export * from "./crud/core/models/column-options.model";
export * from "./crud/core/models/control-array-config.model";
export * from "./crud/core/models/control-options.model";
export * from "./crud/core/models/control-type.model";
export * from "./crud/core/models/crud-item-base.class";
export * from "./crud/core/models/crud-item-factory.model";
export * from "./crud/core/models/crud-item-options.model";
export * from "./crud/core/models/excel.model";
export * from "./crud/core/models/form-field-interaction.event";
export * from "./crud/core/models/input-type.model";
export * from "./crud/core/ui/crud-buttons/crud-buttons.component";
// --- CRUD: UI components (public-facing) ---
export * from "./crud/core/ui/edition-dialog/edition-dialog.component";
export * from "./crud/core/ui/history/history-mapper.token";
export * from "./crud/core/ui/history/history.component";
export * from "./crud/core/ui/history/history.model";
// --- CRUD: shared utilities ---
export * from "./crud/core/utils/adapter/adapter.model";
// --- CRUD: shared configs ---
export * from "./crud/core/utils/confs/archived-config";
export * from "./crud/core/utils/confs/audit.config";
export * from "./crud/core/utils/confs/id-config";
// --- CRUD: service layer ---
export * from "./crud/core/utils/crud-service/acl-adapter";
export * from "./crud/core/utils/crud-service/config.helper";
export * from "./crud/core/utils/crud-service/crud.model";
export * from "./crud/core/utils/crud-service/crud.repository";
export * from "./crud/core/utils/crud-service/dto.model";
export * from "./crud/core/utils/crud-service/filter-calls";
export * from "./crud/core/utils/crud-service/no-rows";
export * from "./crud/core/utils/dates/dates.utils";
export * from "./crud/core/utils/download/download.service";
export * from "./crud/core/utils/download/form-data.mapper";
export * from "./crud/core/utils/i18n/crud-labels.token";
export * from "./crud/core/utils/numbers/numbers.utils";
export * from "./crud/core/utils/offline/offline.service";
export * from "./crud/core/utils/table/export-mode.model";
export * from "./crud/core/utils/table/filter-level.model";
export * from "./crud/core/utils/table/table-column.model";
export * from "./crud/form/form/form.component";
// --- Form: main entry points ---
export * from "./crud/form/form-builder.service";
// --- Form: renderer adapter ---
export * from "./crud/form/ui/field-renderer/form-field-component-base";
export * from "./crud/form/ui/field-renderer/form-field-component.token";
export * from "./crud/form/ui/field-renderer/form-field-renderer.token";
export * from "./crud/form/ui/field-renderer/provide-form-field-renderer";

// --- Form: file upload ---
export * from "./crud/form/ui/renderers-primeng/file-upload-input/file-info.class";

// --- Form: validators & utilities ---
export * from "./crud/form/utils/common.validators";
export * from "./crud/form/utils/email.validator";
export * from "./crud/form/utils/form-error-messages";
export * from "./crud/form/utils/form.injection-token";
export * from "./crud/form/utils/group-validator.model";
export * from "./crud/form/utils/label-strategy.model";
export * from "./crud/form/utils/location.config";
export * from "./crud/form/utils/pattern.validator";
export * from "./crud/form/utils/patterns";
export * from "./crud/form/utils/socials.config";
// --- Table: data access ---
export * from "./crud/table/data-access/table-config.model";
export * from "./crud/table/data-access/table-config.service";
export * from "./crud/table/utils/excel/location-interceptor.service";
// --- Table: main entry point ---
export * from "./crud/table/table.component";
export * from "./crud/table/utils/views/table-config.model";
