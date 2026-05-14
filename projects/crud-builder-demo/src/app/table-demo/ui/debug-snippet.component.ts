import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";

export interface TableDebugConfig {
  tableTitle: string;
  entityLabel: string;
  filterable: boolean;
  filterLevel: "basic" | "advanced";
  sortable: boolean;
  clickableRows: boolean;
  paginator: boolean;
  isCsvExportEnabled: boolean;
  isExcelExportEnabled: boolean;
  excelExportMode: "local" | "server";
  areColumnsConfigurable: boolean;
  areColumnsResizable: boolean;
  editionDialogSize: "xs" | "s" | "m" | "l";
  editionDialogWidth: string;
  editionDialogHeight: string;
  selectable: boolean;
  lazy: boolean;
  isContextMenuEnabled: boolean;
  isDefaultEditionDisabled: boolean;
  isPreferencesModeEnabled: boolean;
  canAccessItemFromUrl: boolean;
  persistState: boolean;
  stateStorage: "local" | "session";
  stripedRows: boolean;
  readonlyIfInactive: boolean;
  customActionsTemplate: boolean;
}

@Component({
  selector: "tbl-debug-snippet",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .debug-section {
      margin-top: 1rem;
    }

    .debug-toggle {
      all: unset;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--p-text-muted-color);
      user-select: none;

      &:hover {
        color: var(--p-text-color);
      }
    }

    .debug-snippet {
      margin-top: 0.5rem;
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--p-surface-800, #1e1e1e);
      color: var(--p-surface-100, #d4d4d4);
      font-size: 0.82rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }
  `,
  ],
  template: `
    <div class="debug-section">
      <button
        type="button"
        class="debug-toggle"
        (click)="isVisible.set(!isVisible())">
        {{ isVisible() ? '▼' : '▶' }} Voir le template
      </button>
      @if (isVisible()) {
        <pre class="debug-snippet">{{ snippet() }}</pre>
      }
    </div>
  `,
})
export class DebugSnippetComponent {
  public readonly config = input.required<TableDebugConfig>();
  protected readonly isVisible = signal(false);

  protected readonly snippet = computed(() => {
    const c = this.config();
    const lines: string[] = ["<tbl-table"];

    // Required inputs
    lines.push('  [config]="yourConfig"');
    lines.push('  entityId="your-entity-id"');
    lines.push(`  tableTitle="${c.tableTitle}"`);
    lines.push('  [entityFactory]="yourEntityFactory"');
    lines.push('  [httpCalls]="yourHttpCalls"');

    // Optional — only shown when non-default
    if (c.entityLabel) lines.push(`  entityLabel="${c.entityLabel}"`);
    if (!c.filterable) lines.push('  [filterable]="false"');
    if (c.filterLevel !== "basic")
      lines.push(`  filterLevel="${c.filterLevel}"`);
    if (!c.sortable) lines.push('  [sortable]="false"');
    if (!c.clickableRows) lines.push('  [clickableRows]="false"');
    if (!c.paginator) lines.push('  [paginator]="false"');
    if (!c.isCsvExportEnabled) lines.push('  [isCsvExportEnabled]="false"');
    if (c.isExcelExportEnabled) lines.push('  [isExcelExportEnabled]="true"');
    if (c.excelExportMode !== "server")
      lines.push(`  excelExportMode="${c.excelExportMode}"`);
    if (!c.areColumnsConfigurable)
      lines.push('  [areColumnsConfigurable]="false"');
    if (!c.areColumnsResizable) lines.push('  [areColumnsResizable]="false"');
    if (c.editionDialogSize !== "s")
      lines.push(`  editionDialogSize="${c.editionDialogSize}"`);
    if (c.editionDialogWidth)
      lines.push(`  editionDialogWidth="${c.editionDialogWidth}"`);
    if (c.editionDialogHeight)
      lines.push(`  editionDialogHeight="${c.editionDialogHeight}"`);
    if (c.selectable) lines.push('  [selectable]="true"');
    if (!c.lazy) lines.push('  [lazy]="false"');
    if (c.isContextMenuEnabled) lines.push('  [isContextMenuEnabled]="true"');
    if (c.isDefaultEditionDisabled)
      lines.push('  [isDefaultEditionDisabled]="true"');
    if (c.isPreferencesModeEnabled)
      lines.push('  [isPreferencesModeEnabled]="true"');
    if (c.canAccessItemFromUrl) lines.push('  [canAccessItemFromUrl]="true"');
    if (c.persistState) {
      lines.push('  [persistState]="true"');
      if (c.stateStorage !== "session")
        lines.push(`  stateStorage="${c.stateStorage}"`);
    }
    if (!c.stripedRows) lines.push('  [stripedRows]="false"');
    if (c.readonlyIfInactive)
      lines.push('  [additionalReadonlyProperties]="{ active: false }"');
    if (c.customActionsTemplate)
      lines.push('  [customActionsTemplate]="yourCustomActionsTemplate"');

    lines.push("/>");
    return lines.join("\n");
  });
}
