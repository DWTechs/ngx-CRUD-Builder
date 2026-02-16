import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { TableComponent } from "@table/table.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { DEMO_CONF } from "../form-demo/demo.conf";

interface DemoUser extends CrudItemBase {
  id: number;
  name: string;
  email: string;
  age: number;
  salary?: number;
  description?: string;
  birthDate?: Date;
  country?: string;
  languages?: string[];
  city?: string;
  gender?: string;
  subscription?: string;
  active?: boolean;
}

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
  template: `
    <div class="table-demo-container">
      <h2>Table Configuration Demo</h2>
      
      <div class="demo-controls">
        <div class="demo-control">
          <label>Entity Label</label>
          <input 
            pInputText 
            [(ngModel)]="tempEntityLabel"
            placeholder="e.g., User, Customer" />
        </div>

        <div class="demo-control">
          <label>Table Title</label>
          <input 
            pInputText 
            [(ngModel)]="tempTableTitle"
            placeholder="e.g., Users, Customers" />
        </div>

        <div class="demo-control">
          <label>Edition Dialog Size</label>
          <p-select 
            [options]="dialogSizeOptions" 
            [(ngModel)]="tempDialogSize"
            placeholder="Select size" 
          />
        </div>

        <div class="demo-control">
          <label>Dialog Width</label>
          <input 
            pInputText 
            [(ngModel)]="tempDialogWidth"
            placeholder="e.g., 50vw, 800px" />
        </div>

        <div class="demo-control">
          <label>Dialog Height</label>
          <input 
            pInputText 
            [(ngModel)]="tempDialogHeight"
            placeholder="e.g., 80vh, 600px" />
        </div>

        <div class="demo-control">
          <label>Filter Level</label>
          <p-select 
            [options]="filterLevelOptions" 
            [(ngModel)]="tempFilterLevel"
            placeholder="Select filter level" 
          />
        </div>

        <div class="demo-control">
          <label>Excel Export Mode</label>
          <p-select 
            [options]="excelExportModeOptions" 
            [(ngModel)]="tempExcelExportMode"
            placeholder="Select mode" 
          />
        </div>

        <div class="demo-control">
          <label>State Storage</label>
          <p-select 
            [options]="stateStorageOptions" 
            [(ngModel)]="tempStateStorage"
            placeholder="Select storage" 
          />
        </div>

        <div class="checkboxes">
          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempFilterable"
              binary="true" />
            <label>Filterable</label>
          </div>
          
          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempSortable"
              binary="true" />
            <label>Sortable</label>
          </div>
          
          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempClickableRows"
              binary="true" />
            <label>Clickable Rows</label>
          </div>
          
          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempShowPagination"
              binary="true" />
            <label>Show Pagination</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempShowColumnSelection"
              binary="true" />
            <label>Column Selection</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempIsCsvExportEnabled"
              binary="true" />
            <label>CSV Export</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempIsExcelExportEnabled"
              binary="true" />
            <label>Excel Export</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempAreColumnsConfigurable"
              binary="true" />
            <label>Configurable Columns</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempAreColumnsResizable"
              binary="true" />
            <label>Resizable Columns</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempSelectable"
              binary="true" />
            <label>Selectable Rows</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempLazy"
              binary="true" />
            <label>Lazy Loading</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempProtectDeletion"
              binary="true" />
            <label>Protect Deletion</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempIsContextMenuEnabled"
              binary="true" />
            <label>Context Menu</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempIsDefaultEditionDisabled"
              binary="true" />
            <label>Disable Default Edition</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempIsPreferencesModeEnabled"
              binary="true" />
            <label>Preferences Mode</label>
          </div>

          <div class="demo-control">
            <p-checkbox 
              [(ngModel)]="tempCanAccessItemFromUrl"
              binary="true" />
            <label>URL Item Access</label>
          </div>
        </div>

        <p-button label="Apply" (click)="applyConfig()" />
      </div>

      <div class="live-demo">
        <h3>Preview</h3>
        @if (tableConfig()) {
          <tbl-table
            [config]="tableConfig()!"
            [entityId]="'demo-user'"
            [entityLabel]="entityLabel()"
            [tableTitle]="tableTitle()"
            [entityFactory]="entityFactory"
            [httpCalls]="httpCalls"
            [filterable]="filterable()"
            [filterLevel]="filterLevel()"
            [sortable]="sortable()"
            [clickableRows]="clickableRows()"
            [paginator]="showPagination()"
            [isCsvExportEnabled]="isCsvExportEnabled()"
            [isExcelExportEnabled]="isExcelExportEnabled()"
            [excelExportMode]="excelExportMode()"
            [areColumnsConfigurable]="areColumnsConfigurable()"
            [areColumnsResizable]="areColumnsResizable()"
            [editionDialogSize]="selectedDialogSize()"
            [editionDialogWidth]="dialogWidth() || undefined"
            [editionDialogHeight]="dialogHeight() || undefined"
            [selectable]="selectable()"
            [lazy]="lazy()"
            [protectDeletion]="protectDeletion()"
            [isContextMenuEnabled]="isContextMenuEnabled()"
            [isDefaultEditionDisabled]="isDefaultEditionDisabled()"
            [isPreferencesModeEnabled]="isPreferencesModeEnabled()"
            [canAccessItemFromUrl]="canAccessItemFromUrl()"
            [stateStorage]="stateStorage()"
            [forceReload]="forceReload()"
          />
        }
      </div>
    </div>
  `,
})
export class TableDemo {
  // Temporary values for controls (before applying)
  protected tempEntityLabel = "User";
  protected tempTableTitle = "Users";
  protected tempDialogSize: "xs" | "s" | "m" | "l" = "s";
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
  protected tempProtectDeletion = false;
  protected tempIsContextMenuEnabled = false;
  protected tempIsDefaultEditionDisabled = false;
  protected tempIsPreferencesModeEnabled = false;
  protected tempCanAccessItemFromUrl = false;
  protected tempStateStorage: "local" | "session" = "session";

  // Applied configuration signals (used by the table)
  protected readonly entityLabel = signal("User");
  protected readonly tableTitle = signal("Users");
  protected readonly selectedDialogSize = signal<"xs" | "s" | "m" | "l">("s");
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
  protected readonly protectDeletion = signal(false);
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

  // Mock data
  private readonly mockUsers: DemoUser[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 28,
      salary: 65000,
      description: "Senior developer with expertise in Angular",
      birthDate: new Date("1996-03-15"),
      country: "FR",
      languages: ["en", "fr"],
      city: "paris",
      gender: "F",
      subscription: "premium",
      active: true,
      archived: false,
      archivedAt: null,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      age: 34,
      salary: 75000,
      description: "Full-stack developer and team lead",
      birthDate: new Date("1990-07-22"),
      country: "UK",
      languages: ["en"],
      city: "london",
      gender: "M",
      subscription: "premium",
      active: true,
      archived: false,
      archivedAt: null,
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      age: 25,
      salary: 50000,
      description: "Junior developer learning Angular",
      birthDate: new Date("1999-11-08"),
      country: "DE",
      languages: ["en", "de"],
      city: "berlin",
      gender: "M",
      subscription: "basic",
      active: false,
      archived: false,
      archivedAt: null,
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      age: 31,
      salary: 80000,
      description: "UI/UX designer with frontend skills",
      birthDate: new Date("1993-02-14"),
      country: "ES",
      languages: ["en", "es"],
      city: "madrid",
      gender: "F",
      subscription: "premium",
      active: true,
      archived: false,
      archivedAt: null,
    },
    {
      id: 5,
      name: "Ethan Hunt",
      email: "ethan@example.com",
      age: 29,
      salary: 70000,
      description: "Backend specialist focusing on APIs",
      birthDate: new Date("1995-09-30"),
      country: "IT",
      languages: ["en", "it"],
      city: "rome",
      gender: "M",
      subscription: "basic",
      active: true,
      archived: false,
      archivedAt: null,
    },
  ];

  // Entity factory
  protected readonly entityFactory = (): DemoUser => ({
    id: 0,
    name: "",
    email: "",
    age: 18,
    active: true,
    archived: false,
    archivedAt: null,
  });

  // HTTP calls (mocked)
  protected readonly httpCalls: Calls<DemoUser> = {
    get: () => {
      return of({
        rows: this.mockUsers,
        total: this.mockUsers.length,
      }).pipe(delay(500));
    },
    create: (item: DemoUser) => {
      const newItem = {
        ...item,
        id: Math.max(...this.mockUsers.map((u) => u.id)) + 1,
      };
      this.mockUsers.push(newItem);
      return of({ rows: [newItem] }).pipe(delay(300));
    },
    update: (item: DemoUser) => {
      const index = this.mockUsers.findIndex((u) => u.id === item.id);
      if (index !== -1) {
        this.mockUsers[index] = item;
      }
      return of({ rows: [item] }).pipe(delay(300));
    },
    archive: (indexes: number[]) => {
      for (const index of indexes) {
        this.mockUsers[index].archived = true;
        this.mockUsers[index].archivedAt = new Date();
      }

      return of(null).pipe(delay(300));
    },
  };

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
    this.protectDeletion.set(this.tempProtectDeletion);
    this.isContextMenuEnabled.set(this.tempIsContextMenuEnabled);
    this.isDefaultEditionDisabled.set(this.tempIsDefaultEditionDisabled);
    this.isPreferencesModeEnabled.set(this.tempIsPreferencesModeEnabled);
    this.canAccessItemFromUrl.set(this.tempCanAccessItemFromUrl);
    this.stateStorage.set(this.tempStateStorage);
    this.forceReload.update((n) => n + 1);
  }
}
