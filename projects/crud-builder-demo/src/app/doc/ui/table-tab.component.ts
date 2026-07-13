import { Component } from "@angular/core";

@Component({
  selector: "doc-table-tab",
  standalone: true,
  template: `
    <div class="doc-content">
      <h2>Overview</h2>
      <p>A powerful, configurable table component for CRUD operations with built-in features like filtering, sorting, pagination, and export capabilities.</p>

      <h2>Inputs</h2>

      <h3>Core Configuration</h3>

      <h4><code>config</code> (required)</h4>
      <p><strong>Type:</strong> <code>CrudItemOptions[]</code></p>
      <p><strong>Description:</strong> Defines the structure and behavior of table columns and form fields.</p>
      <pre><code>config: [
  &#123;
    key: 'name',
    label: 'Name',
    controlType: CONTROL_TYPES.INPUT,
  &#125;,
  &#123;
    key: 'email',
    label: 'Email',
    controlType: CONTROL_TYPES.INPUT,
  &#125;
]</code></pre>

      <h4><code>httpCalls</code> (required)</h4>
      <p><strong>Type:</strong> <code>CrudCalls&lt;TData&gt;</code></p>
      <p><strong>Description:</strong> Configuration object containing all HTTP operations for CRUD functionality.</p>
      <pre><code>httpCalls: &#123;
  get: (params) => this.userService.getUsers(params),
  create: (user) => this.userService.createUser(user),
  update: (user) => this.userService.updateUser(user),
  archive: (ids) => this.userService.deleteUsers(ids)
&#125;</code></pre>

      <h4><code>entityFactory</code> (required)</h4>
      <p><strong>Type:</strong> <code>CrudItemFactory&lt;TData&gt;</code></p>
      <p><strong>Description:</strong> Factory function that creates new entity instances for the creation dialog.</p>
      <pre><code>entityFactory: () => (&#123;
  id: null,
  name: '',
  email: '',
  status: 'active'
&#125;)</code></pre>

      <h4><code>entityId</code> (required)</h4>
      <p><strong>Type:</strong> <code>string</code></p>
      <p><strong>Description:</strong> Unique identifier for the entity type, used for persisting column preferences.</p>
      <pre><code>entityId: "users"</code></pre>

      <h4><code>tableTitle</code> (required)</h4>
      <p><strong>Type:</strong> <code>string</code></p>
      <p><strong>Description:</strong> Display title shown at the top of the table component.</p>
      <pre><code>tableTitle: "Users"</code></pre>

      <h3>Display & Behavior</h3>

      <h4><code>clickableRows</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Determines user interaction mode with table rows.</p>
      <pre><code>// Clickable rows - click anywhere on row to edit
clickableRows: true

// Non-clickable rows - only action buttons work
clickableRows: false</code></pre>

      <h4><code>lazy</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables lazy loading mode for large datasets.</p>
      <pre><code>// For large datasets (&gt;1000 rows)
lazy: true

// Load all data at once (&lt;500 rows)
lazy: false</code></pre>

      <h4><code>selectable</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables row selection with checkboxes for bulk operations.</p>

      <h4><code>customRowStyles</code></h4>
      <p><strong>Type:</strong> <code>(row: TData) => Record&lt;string, string&gt;</code></p>
      <p><strong>Description:</strong> Applies conditional CSS styles to table rows.</p>
      <pre><code>customRowStyles: (row) => (&#123;
  'background-color': row.status === 'inactive' ? '#ffe6e6' : '',
  'color': row.priority === 'high' ? '#d32f2f' : ''
&#125;)</code></pre>

      <h3>Table Features</h3>

      <h4><code>filterable</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Enables/disables column filtering functionality.</p>

      <h4><code>sortable</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Enables column sorting functionality.</p>

      <h4><code>paginator</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Enables pagination controls.</p>

      <h4><code>filterLevel</code></h4>
      <p><strong>Type:</strong> <code>FilterLevel</code> | <strong>Default:</strong> <code>"basic"</code></p>
      <p><strong>Description:</strong> Defines the complexity level of filtering interface.</p>

      <h4><code>isContextMenuEnabled</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables the context menu on right-clicking table rows.</p>
      <p>When enabled, right-clicking a row shows a context menu with actions like View and Edit. Context menu actions emit the same events as clicking the row or action buttons. Useful for providing quick access to common actions without cluttering the UI.</p>
      <pre><code>// Enable context menu
isContextMenuEnabled: true

// Disable context menu (default)
isContextMenuEnabled: false</code></pre>

      <h3>Export Options</h3>

      <h4><code>isCsvExportEnabled</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Enables CSV export functionality.</p>

      <h4><code>isExcelExportEnabled</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables Excel export functionality.</p>

      <h4><code>excelExportMode</code></h4>
      <p><strong>Type:</strong> <code>ExcelExportMode</code> | <strong>Default:</strong> <code>"server"</code></p>
      <p><strong>Description:</strong> Determines how Excel export is processed: by front-end ('local') or by back-end ('server').</p>

      <h3>Dialog Configuration</h3>

      <h4><code>editionDialogWidth</code></h4>
      <p><strong>Type:</strong> <code>string</code> | <strong>Default:</strong> <code>"70vw"</code></p>
      <p><strong>Description:</strong> Sets the width of the edition/creation dialog modal.</p>
      <pre><code>// Standard width
editionDialogWidth: "70vw"

// Narrow for simple forms
editionDialogWidth: "400px"

// Wide for complex forms
editionDialogWidth: "90vw"</code></pre>

      <h4><code>isDefaultEditionDisabled</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Disables the default edition modal dialog.</p>

      <h4><code>editionDialogTitle</code></h4>
      <p><strong>Type:</strong> <code>string</code> | <strong>Default:</strong> <code>""</code></p>
      <p><strong>Description:</strong> Custom title for the edition dialog.</p>

      <h3>Access Control & Navigation</h3>

      <h4><code>functionalityKey</code></h4>
      <p><strong>Type:</strong> <code>number | undefined</code></p>
      <p><strong>Description:</strong> Links the table to a specific functionality for access control.</p>

      <h4><code>shouldSyncPageWithUrl</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables URL synchronization for the current page. When enabled, the page number is written as <code>?page=2</code> and restored on init. Can be combined with <code>shouldSyncIdWithUrl</code>.</p>

      <h4><code>shouldSyncIdWithUrl</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Enables URL synchronization for the opened item. When enabled, opening an item writes <code>?id=123</code> in the URL and the item is restored on init. Can be combined with <code>shouldSyncPageWithUrl</code>.</p>

      <h3>Column Management</h3>

      <h4><code>areColumnsConfigurable</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>true</code></p>
      <p><strong>Description:</strong> Controls whether columns can be hidden/shown through the configuration dialog.</p>

      <h3>Advanced Options</h3>

      <h4><code>entityLabel</code></h4>
      <p><strong>Type:</strong> <code>string</code> | <strong>Default:</strong> <code>""</code></p>
      <p><strong>Description:</strong> Human-readable label for a single entity instance.</p>

      <h4><code>forceReload</code></h4>
      <p><strong>Type:</strong> <code>number</code></p>
      <p><strong>Description:</strong> Trigger for forcing table data reload from parent component.</p>

      <h4><code>groupValidator</code></h4>
      <p><strong>Type:</strong> <code>ValidatorFn | undefined</code></p>
      <p><strong>Description:</strong> Custom validator function applied to the entire form group.</p>
      <pre><code>groupValidator: (group: AbstractControl) => &#123;
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  return start && end && start > end ? &#123; dateRange: true &#125; : null;
&#125;</code></pre>

      <h4><code>customActionsTemplate</code></h4>
      <p><strong>Type:</strong> <code>TemplateRef&lt;unknown&gt;</code></p>
      <p><strong>Description:</strong> Custom template for actions in the table's action column. Allows injection of custom buttons or controls in place of the default edit/delete actions.</p>
      <p>The template receives the current row data as context via <code>let-rowData</code>, enabling dynamic action visibility and behavior based on row content.</p>
      <pre><code>// Component template
&lt;tbl-table 
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  [customActionsTemplate]="customActions"
  entityId="users"
  tableTitle="Users"&gt;
&lt;/tbl-table&gt;

&lt;ng-template #customActions let-rowData&gt;
  &lt;!-- View details action --&gt;
  &lt;p-button 
    icon="pi pi-eye" 
    severity="info" 
    size="small"
    (onClick)="viewDetails(rowData)"
    [pTooltip]="'View Details'"&gt;
  &lt;/p-button&gt;
  
  &lt;!-- Conditional duplicate action --&gt;
  &lt;p-button 
    *ngIf="rowData.status === 'active'"
    icon="pi pi-copy" 
    severity="secondary" 
    size="small"
    (onClick)="duplicate(rowData)"
    [pTooltip]="'Duplicate'"&gt;
  &lt;/p-button&gt;
  
  &lt;!-- Export action with confirmation --&gt;
  &lt;p-button 
    icon="pi pi-download" 
    severity="help" 
    size="small"
    (onClick)="exportItem(rowData)"
    [pTooltip]="'Export Item'"&gt;
  &lt;/p-button&gt;
&lt;/ng-template&gt;</code></pre>

      <pre><code>// Component class methods
export class MyComponent &#123;
  viewDetails(rowData: User): void &#123;
    this.router.navigate(['/users', rowData.id, 'details']);
  &#125;
  
  duplicate(rowData: User): void &#123;
    const duplicated = &#123; ...rowData, id: null, name: \`$&#123;rowData.name&#125; (Copy)\` &#125;;
    this.userService.createUser(duplicated).subscribe();
  &#125;
  
  exportItem(rowData: User): void &#123;
    this.exportService.exportSingleUser(rowData.id);
  &#125;
&#125;</code></pre>

      <h2>Outputs</h2>
      <ul>
        <li><code>editionDialogClosed: TData | null</code> - Emitted when edition dialog is closed</li>
        <li><code>formChanged: TData</code> - Emitted when form values change</li>
        <li><code>newClicked: void</code> - Emitted when new button is clicked</li>
        <li><code>rowClicked: TData</code> - Emitted when a row is clicked</li>
        <li><code>validityChanged: boolean</code> - Emitted when form validity changes</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Basic Table</h3>
      <pre><code>&lt;tbl-table
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  entityId="users"
  tableTitle="Users"
  entityLabel="User"&gt;
&lt;/tbl-table&gt;</code></pre>

      <h3>Advanced Table with Custom Features</h3>
      <pre><code>&lt;tbl-table
  [config]="orderConfig"
  [httpCalls]="orderHttpCalls"
  [entityFactory]="orderFactory"
  entityId="orders"
  tableTitle="Purchase Orders"
  entityLabel="Order"
  [lazy]="true"
  [selectable]="true"
  [shouldSyncPageWithUrl]="true"
  [shouldSyncIdWithUrl]="true"
  [isExcelExportEnabled]="true"
  [customRowStyles]="getOrderRowStyles"
  [functionalityKey]="orders"
  editionDialogWidth="80vw"&gt;
&lt;/tbl-table&gt;</code></pre>
    </div>
  `,
})
export class ExampleTableTabComponent {}
