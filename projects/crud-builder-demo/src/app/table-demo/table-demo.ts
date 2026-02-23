import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { TableComponent } from "@table/table.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { DEMO_CONF } from "../form-demo/demo.conf";
import { TableDemoMockService } from "./table-demo-mock.service";

/**
 * Table demo component showcasing table configuration options
 */
@Component({
  selector: "tbl-demo",
  imports: [
    TableComponent,
    FormsModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
  ],
  styleUrls: ["./table-demo.scss"],
  templateUrl: "./table-demo.html",
})
export class TableDemo {
  constructor(protected readonly mockService: TableDemoMockService) {}
  // Temporary values for controls (before applying)
  protected tempEntityLabel = "User";
  protected tempTableTitle = "Users";
  protected tempDialogSize: "xs" | "s" | "m" | "l" = "m";
  protected tempDialogWidth = "";
  protected tempDialogHeight = "";
  protected tempFilterable = true;
  protected tempFilterLevel: "basic" | "advanced" = "basic";
  protected tempSortable = true;
  protected tempClickableRows = true;
  protected tempShowPagination = true;
  protected tempShowColumnSelection = true;
  protected tempIsCsvExportEnabled = true;
  protected tempIsExcelExportEnabled = true;
  protected tempExcelExportMode: "local" | "server" = "server";
  protected tempAreColumnsConfigurable = true;
  protected tempAreColumnsResizable = true;
  protected tempSelectable = false;
  protected tempLazy = true;
  protected tempIsContextMenuEnabled = false;
  protected tempIsDefaultEditionDisabled = false;
  protected tempIsPreferencesModeEnabled = false;
  protected tempCanAccessItemFromUrl = false;
  protected tempStateStorage: "local" | "session" = "session";

  // Applied configuration signals (used by the table)
  protected readonly entityLabel = signal("User");
  protected readonly tableTitle = signal("Users");
  protected readonly selectedDialogSize = signal<"xs" | "s" | "m" | "l">("m");
  protected readonly dialogWidth = signal("");
  protected readonly dialogHeight = signal("");
  protected readonly filterable = signal(true);
  protected readonly filterLevel = signal<"basic" | "advanced">("basic");
  protected readonly sortable = signal(true);
  protected readonly clickableRows = signal(true);
  protected readonly showPagination = signal(true);
  protected readonly showColumnSelection = signal(true);
  protected readonly isCsvExportEnabled = signal(true);
  protected readonly isExcelExportEnabled = signal(true);
  protected readonly excelExportMode = signal<"local" | "server">("server");
  protected readonly areColumnsConfigurable = signal(true);
  protected readonly areColumnsResizable = signal(true);
  protected readonly selectable = signal(false);
  protected readonly lazy = signal(true);
  protected readonly isContextMenuEnabled = signal(false);
  protected readonly isDefaultEditionDisabled = signal(false);
  protected readonly isPreferencesModeEnabled = signal(false);
  protected readonly canAccessItemFromUrl = signal(false);
  protected readonly stateStorage = signal<"local" | "session">("session");
  protected readonly forceReload = signal(0);

  // Table configuration
  protected readonly tableConfig = signal<CrudItemOptions[]>(DEMO_CONF);

  // Options for dropdowns
  protected readonly rowsPerPageOptions = [
    { label: "5 rows", value: 5 },
    { label: "10 rows", value: 10 },
    { label: "25 rows", value: 25 },
    { label: "50 rows", value: 50 },
  ];

  protected readonly paginationPositions = [
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Both", value: "both" },
  ];

  protected readonly dialogSizeOptions = [
    { label: "Extra Small (1 col)", value: "xs" },
    { label: "Small (2 cols)", value: "s" },
    { label: "Medium (3 cols)", value: "m" },
    { label: "Large (4 cols)", value: "l" },
  ];

  protected readonly filterLevelOptions = [
    { label: "Basic", value: "basic" },
    { label: "Advanced", value: "advanced" },
  ];

  protected readonly excelExportModeOptions = [
    { label: "Local (Browser)", value: "local" },
    { label: "Server", value: "server" },
  ];

  protected readonly stateStorageOptions = [
    { label: "Local Storage", value: "local" },
    { label: "Session Storage", value: "session" },
  ];

  /**
   * Apply the current configuration
   */
  protected applyConfig(): void {
    this.entityLabel.set(this.tempEntityLabel);
    this.tableTitle.set(this.tempTableTitle);
    this.selectedDialogSize.set(this.tempDialogSize);
    this.dialogWidth.set(this.tempDialogWidth);
    this.dialogHeight.set(this.tempDialogHeight);
    this.filterable.set(this.tempFilterable);
    this.filterLevel.set(this.tempFilterLevel);
    this.sortable.set(this.tempSortable);
    this.clickableRows.set(this.tempClickableRows);
    this.showPagination.set(this.tempShowPagination);
    this.showColumnSelection.set(this.tempShowColumnSelection);
    this.isCsvExportEnabled.set(this.tempIsCsvExportEnabled);
    this.isExcelExportEnabled.set(this.tempIsExcelExportEnabled);
    this.excelExportMode.set(this.tempExcelExportMode);
    this.areColumnsConfigurable.set(this.tempAreColumnsConfigurable);
    this.areColumnsResizable.set(this.tempAreColumnsResizable);
    this.selectable.set(this.tempSelectable);
    this.lazy.set(this.tempLazy);
    this.isContextMenuEnabled.set(this.tempIsContextMenuEnabled);
    this.isDefaultEditionDisabled.set(this.tempIsDefaultEditionDisabled);
    this.isPreferencesModeEnabled.set(this.tempIsPreferencesModeEnabled);
    this.canAccessItemFromUrl.set(this.tempCanAccessItemFromUrl);
    this.stateStorage.set(this.tempStateStorage);
    this.forceReload.update((n) => n + 1);
  }
}
