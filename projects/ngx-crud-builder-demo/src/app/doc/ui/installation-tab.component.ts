import { Component } from "@angular/core";

@Component({
  selector: "doc-installation-tab",
  standalone: true,
  template: `
    <div class="doc-content">
      <h2>Prerequisites</h2>

      <h3>Framework version</h3>
      <p>Angular version must be <code>^22</code>.</p>

      <h3>Peer Dependencies</h3>
      <p>Required peer dependencies that must be installed:</p>
      <pre><code>// Optimus UI dependencies
"&#64;openng/optimus-ui": "^2.0.0-rc.0",
// Required by table module
"exceljs": "4.4.0",
"file-saver": "2.0.5",
// Required by Optimus UI
"chart.js": "3.3.2",
"quill": "2.0.2",
// Dev dependencies
"&#64;types/chart.js": "2.9.41",
"&#64;types/file-saver": "2.0.7"</code></pre>

      <h2>Installation</h2>

      <h3>1. Copy the CRUD library</h3>
      <ul>
        <li>Copy the directory <code>front/projects/crud/</code></li>
        <li>Paste it in your project</li>
      </ul>

      <h3>2. Import styles from Optimus UI</h3>
      <p>In your main.ts file, where you provide the root configuration for the application, add the Optimus UI provider:</p>
      <pre><code>import {{ '{' }} ApplicationConfig {{ '}' }} from '&#64;angular/core';
import {{ '{' }} provideOptimus {{ '}' }} from '&#64;openng/optimus-ui/config';
import Aura from '&#64;openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {{ '{' }}
    providers: [
        provideOptimus({{ '{' }}
            theme: {{ '{' }}
                preset: Aura
            {{ '}' }}
        {{ '}' }})
    ]
{{ '}' }};</code></pre>

      <p><strong>Note:</strong> Check documentation if you need more customization: <a href="https://www.openng.org/" target="_blank">https://www.openng.org/</a></p>

      <p>Then, in your angular.json file, add styles needed by Optimus UI:</p>
      <pre><code>"styles": [
    "node_modules/&#64;openng/icons/openng-icons.css",
    "node_modules/quill/dist/quill.core.css",
    "node_modules/quill/dist/quill.snow.css",
]</code></pre>

      <p><strong>Note:</strong> Quill dependencies is used by Optimus UI to make the rich-text editor work</p>

      <h3>3. Add paths to TSConfig</h3>
      <p>Add crud lib paths to tsconfig.json:</p>
      <pre><code>"paths": {{ '{' }}
    "&#64;crud/*": [
        "./projects/crud/src/lib/*"
    ],
    "&#64;form/*": [
        "./projects/crud/src/lib/form/*"
    ],
    "&#64;table/*": [
        "./projects/crud/src/lib/table/*"
    ]
{{ '}' }}</code></pre>

      <h2>Configuration</h2>

      <h3>1. Provide custom tokens</h3>
      <p>Create a function to provide them:</p>
      <pre><code>export function provideAppConfig() {{ '{' }}
  return makeEnvironmentProviders([
    {{ '{' }} provide: LOCALE_ID, useValue: "fr" {{ '}' }},
    {{ '{' }} provide: APP_CONFIG, useValue: CONFIG {{ '}' }},
    {{ '{' }} provide: APP_FORM_CONFIG, useValue: FORM_CONFIG {{ '}' }},
    {{ '{' }} provide: SNACKBAR_SERVICE, useExisting: SnackbarService {{ '}' }},
  ]);
{{ '}' }}</code></pre>

      <p>And import this new function <code>provideAppConfig</code> in your <code>ApplicationConfig</code>.</p>

      <h3>2. Choose an adapter</h3>
      <p>
        Form fields and the table shell are decoupled from the library core and each need an adapter. Pick <strong>one</strong>
        adapter and use it for both — don't mix, e.g. an Optimus UI form with a Material table — via <code>provideCrudRenderer()</code>:
      </p>
      <pre><code>import {{ '{' }} provideCrudRenderer {{ '}' }} from '&#64;dwtechs/ngx-crud-builder';

export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [
    ...provideCrudRenderer('optimus-ui'),
  ],
{{ '}' }};</code></pre>
      <p>
        For Angular Material, import <code>provideMaterialCrudRenderer</code> from the separate
        <code>&#64;dwtechs/ngx-crud-builder/material</code> entry point instead — kept apart so
        <code>&#64;angular/material</code> and <code>&#64;angular/animations</code> are only ever resolved by apps that
        actually import it:
      </p>
      <pre><code>import {{ '{' }} provideMaterialCrudRenderer {{ '}' }} from '&#64;dwtechs/ngx-crud-builder/material';

export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [
    ...provideMaterialCrudRenderer(),
  ],
{{ '}' }};</code></pre>
      <table>
        <thead><tr><th>Value</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>'optimus-ui'</code></td><td>Optimus UI controls with float label, icon field, and full styling support (default)</td></tr>
          <tr><td><code>provideMaterialCrudRenderer()</code></td><td>Angular Material controls. Requires <code>&#64;angular/material</code> and <code>&#64;angular/animations</code>. All control types are supported. The table shell handles pagination, sorting and lazy mode, but not filtering, column resizing, state persistence or the context menu.</td></tr>
        </tbody>
      </table>
      <p>
        There is no <code>'native'</code> table shell yet, so <code>provideCrudRenderer</code> only accepts
        <code>'optimus-ui'</code>. If you don't use <code>&lt;tbl-table&gt;</code>, you can use
        <code>provideFormFieldRenderer('native')</code> instead for a lighter, Optimus UI-free form.
      </p>
      <p>Omitting the adapter provider will throw a <code>NullInjectorError</code> at runtime.</p>

      <h3>3. Environment Configuration</h3>
      <p>Add required configuration to your environment files:</p>
      <pre><code>// environment.ts
export const environment = {{ '{' }}
  apiGateway: '/api/',
  // ...
{{ '}' }};</code></pre>

      <h2>Usage</h2>

      <h3>1. Create an Entity Class</h3>
      <p>First, define your entity model:</p>
      <pre><code>// user.class.ts
export class User {{ '{' }}
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  portrait?: string;
  rolesArrayAgg?: number[];
{{ '}' }}</code></pre>

      <h3>2. Create a CRUD Service</h3>
      <p>Create a service that uses <code>CrudRepository</code> to handle HTTP operations:</p>
      <pre><code>&#64;Injectable({{ '{' }} providedIn: "root" {{ '}' }})
export class UsersService {{ '{' }}
  private readonly crud = new CrudRepository&lt;User&gt;().with({{ '{' }}
    endpoint: "users",
    fileOperationsConfig: {{ '{' }}
      apiSuffix: "portrait",
      filePropertyKey: "portrait",
    {{ '}' }},
  {{ '}' }});

  public readonly httpCalls = {{ '{' }}
    get: this.crud.get,
    update: this.crud.update,
    archive: this.crud.archive,
  {{ '}' }};

  public readonly factory = () => new User();
{{ '}' }}</code></pre>

      <h3>3. Define Table Configuration</h3>
      <p>Create a configuration file that defines how your table columns and form fields should behave:</p>
      <pre><code>export const USERS_TABLE_CONF = [
  {{ '{' }}
    key: "firstName",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    label: "First Name",
    controlOptions: {{ '{' }}
      validators: [required],
    {{ '}' }},
  {{ '}' }},
  {{ '{' }}
    key: "email",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.EMAIL,
    label: "Email",
  {{ '}' }},
];</code></pre>

      <h3>4. Create the Component</h3>
      <p>Create a standalone component that uses the CRUD table:</p>
      <pre><code>&#64;Component({{ '{' }}
  selector: "app-users",
  standalone: true,
  imports: [TableComponent],
{{ '}' }})
export class UsersComponent {{ '{' }}
  private readonly usersService = inject(UsersService);

  public readonly conf = USERS_TABLE_CONF;
  public readonly httpCalls = this.usersService.httpCalls;
  public entityFactory = this.usersService.factory;
{{ '}' }}</code></pre>

      <h3>5. Create the Template</h3>
      <p>Use the <code>&lt;tbl-table&gt;</code> component in your template:</p>
      <pre><code>&lt;tbl-table
  [httpCalls]="httpCalls"
  [config]="conf"
  [entityFactory]="entityFactory"
  [entityId]="'users'"
  [tableTitle]="'Users'"
  [lazy]="true"
/&gt;</code></pre>

      <h2>Available Control Types</h2>
      <p>The library supports various control types:</p>
      <ul>
        <li><code>CONTROL_TYPES.INPUT</code> - Text input, email, number, etc.</li>
        <li><code>CONTROL_TYPES.TEXTAREA</code> - Multi-line text input</li>
        <li><code>CONTROL_TYPES.SELECT</code> - Single select dropdown</li>
        <li><code>CONTROL_TYPES.MULTISELECT</code> - Multiple select dropdown</li>
        <li><code>CONTROL_TYPES.AUTOCOMPLETE</code> - Autocomplete input with search</li>
        <li><code>CONTROL_TYPES.CHECKBOX</code> - Checkbox</li>
        <li><code>CONTROL_TYPES.RADIO</code> - Radio buttons</li>
        <li><code>CONTROL_TYPES.SELECT_BUTTON</code> - Select button group</li>
        <li><code>CONTROL_TYPES.DATE</code> - Date picker</li>
        <li><code>CONTROL_TYPES.FILES</code> - File upload</li>
        <li><code>CONTROL_TYPES.PICKLIST</code> - Dual list selection</li>
        <li><code>CONTROL_TYPES.WYSIWYG</code> - Rich text editor (WYSIWYG)</li>
        <li><code>CONTROL_TYPES.TABLE</code> - Nested table control</li>
        <li><code>CONTROL_TYPES.GROUP</code> - Form group for nested structures</li>
        <li><code>CONTROL_TYPES.CUSTOM</code> - Custom component integration</li>
      </ul>

      <h2>Table Features</h2>
      <p>The table component provides:</p>
      <ul>
        <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete with confirmation dialogs</li>
        <li><strong>Lazy Loading:</strong> Efficient data loading with pagination</li>
        <li><strong>Filtering:</strong> Advanced column filtering capabilities</li>
        <li><strong>Sorting:</strong> Multi-column sorting</li>
        <li><strong>Excel Export:</strong> Export table data to Excel</li>
        <li><strong>File Upload:</strong> Integrated file management</li>
        <li><strong>History:</strong> Track entity changes over time</li>
        <li><strong>Archive/Restore:</strong> Soft delete functionality</li>
      </ul>
    </div>
  `,
})
export class InstallationTabComponent {}
