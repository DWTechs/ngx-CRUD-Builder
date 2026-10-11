import { Component } from "@angular/core";

@Component({
  selector: "doc-form-tab",
  standalone: true,
  template: `
    <div class="doc-content">
      <h2>Overview</h2>
      <p>A dynamic form component that generates reactive forms based on configuration objects. Supports conditional logic, validation, and various field types with automatic form generation and validation.</p>

      <h2>Inputs</h2>

      <h3>Core Configuration</h3>

      <h4><code>config</code> (required, model)</h4>
      <p><strong>Type:</strong> <code>CrudItemOptions[]</code></p>
      <p><strong>Description:</strong> Configuration array that defines the structure and behavior of form fields.</p>
      <pre><code>config: [
  &#123;
    key: 'name',
    label: 'Full Name',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: &#123;
        validators: [required],
    &#125;
  &#125;,
  &#123;
    key: 'age',
    label: 'Age',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
  &#125;,
  // ...
]</code></pre>

      <h4><code>model</code> (required, model)</h4>
      <p><strong>Type:</strong> <code>any</code></p>
      <p><strong>Description:</strong> Two-way binding for form values. Contains the current state of all form fields.</p>
      <pre><code>// Initial form values
model = &#123;
  name: '',
  email: '',
  age: null,
  preferences: &#123;
    newsletter: true,
    theme: 'light'
  &#125;
&#125;</code></pre>

      <h3>Display Options</h3>

      <h4><code>columnsCount</code></h4>
      <p><strong>Type:</strong> <code>1 | 2 | 3</code> | <strong>Default:</strong> <code>1</code></p>
      <p><strong>Description:</strong> Defines the number of columns for form layout.</p>
      <pre><code>// Single column layout (full width)
columnsCount: 1

// Two column layout (50% width each)
columnsCount: 2

// Three column layout (33.33% width each)
columnsCount: 3</code></pre>

      <h4><code>showSubmit</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Shows/hides the submit button.</p>
      <pre><code>// Show submit button
&lt;frm-form [showSubmit]="true" (submitted)="onSubmit($event)" /&gt;

// Hide submit button (custom submission handling)
&lt;frm-form [showSubmit]="false" /&gt;</code></pre>

      <h4><code>showReset</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Shows/hides the reset button.</p>

      <h4><code>showDebug</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Shows debug information including form values and validation state.</p>

      <h3>Form Behavior</h3>

      <h4><code>isReadonly</code></h4>
      <p><strong>Type:</strong> <code>boolean</code> | <strong>Default:</strong> <code>false</code></p>
      <p><strong>Description:</strong> Makes the entire form read-only.</p>
      <pre><code>// Editable form
&lt;frm-form [isReadonly]="false" /&gt;

// Read-only form (view mode)
&lt;frm-form [isReadonly]="true" /&gt;

// Conditional readonly based on user permissions
&lt;frm-form [isReadonly]="!canEdit" /&gt;</code></pre>

      <h4><code>groupValidator</code></h4>
      <p><strong>Type:</strong> <code>ValidatorFn | undefined</code></p>
      <p><strong>Description:</strong> Custom validator applied to the entire form group.</p>
      <pre><code>// Cross-field validation
groupValidator: (group: AbstractControl) => &#123;
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  
  if (start && end && start > end) &#123;
    return &#123; dateRange: 'Start date must be before end date' &#125;;
  &#125;
  
  return null;
&#125;</code></pre>

      <h3>Form Control</h3>

      <h4><code>forceReload</code></h4>
      <p><strong>Type:</strong> <code>number</code> | <strong>Default:</strong> <code>0</code></p>
      <p><strong>Description:</strong> Trigger to force form recreation. Increment to reload.</p>

      <h4><code>forceReloadValues</code></h4>
      <p><strong>Type:</strong> <code>number</code> | <strong>Default:</strong> <code>0</code></p>
      <p><strong>Description:</strong> Trigger to force form values reload without recreating the form.</p>

      <h3>Button Customization</h3>

      <h4><code>submitButtonLabel</code></h4>
      <p><strong>Type:</strong> <code>string</code> | <strong>Default:</strong> <code>"Valider"</code></p>
      <p><strong>Description:</strong> Custom label for the submit button.</p>

      <h4><code>resetButtonLabel</code></h4>
      <p><strong>Type:</strong> <code>string</code> | <strong>Default:</strong> <code>"Réinitialiser"</code></p>
      <p><strong>Description:</strong> Custom label for the reset button.</p>

      <h3>Label Display Options</h3>

      <h4><code>labelStrategy</code></h4>
      <p><strong>Type:</strong> <code>'normal' | 'float' | 'ifta'</code> | <strong>Default:</strong> <code>'ifta'</code></p>
      <p><strong>Description:</strong> Defines how field labels are displayed across the form.</p>
      <ul>
        <li><strong>normal</strong>: Traditional label positioned above the input field</li>
        <li><strong>float</strong>: Label starts inside the field and floats above when focused or filled</li>
        <li><strong>ifta</strong>: Labels stays inside the input container</li>
      </ul>

      <h2>Outputs</h2>
      <ul>
        <li><code>modelChange: any</code> - Emitted when form values change (two-way binding)</li>
        <li><code>validityChange: boolean</code> - Emitted when form validation state changes</li>
        <li><code>fieldInteraction: FormFieldInteractionEvent</code> - Emitted when user interacts with form fields</li>
        <li><code>submitted: any</code> - Emitted when form is submitted (if showSubmit is true)</li>
        <li><code>reset: void</code> - Emitted when form is reset (if showReset is true)</li>
      </ul>

      <h2>Control Types</h2>

      <h3>File Upload Controls</h3>
      <p>File upload controls allow users to upload and manage files. Use <code>CONTROL_TYPES.FILES</code> for file handling.</p>
      <pre><code>config: [
  &#123;
    key: 'documents',
    label: 'Documents',
    controlType: CONTROL_TYPES.FILES,
    controlOptions: &#123;
      multiple: true,
      maxFileSize: 8000000, // 8MB
      mediaType: 'document',
      isPreviewEnabled: false,
      filesPathResolver: (model) => \`$&#123;environment.apiGateway&#125;/files/$&#123;model.uuid&#125;\`
    &#125;
  &#125;
]</code></pre>

      <h4>File Control Options</h4>
      <ul>
        <li><strong>multiple</strong>: Allow multiple file selection</li>
        <li><strong>maxFileSize</strong>: Maximum file size in bytes</li>
        <li><strong>mediaType</strong>: 'image' for images or 'document' for documents</li>
        <li><strong>isPreviewEnabled</strong>: Show a thumbnail next to each uploaded image and enlarge it in a modal on click</li>
        <li><strong>filesPathResolver</strong>: Function to resolve file paths from model data</li>
      </ul>

      <h3>Number Input Controls</h3>
      <p>Number input controls allow users to enter numeric values with validation and formatting options.</p>
      <pre><code>config: [
  &#123;
    key: 'price',
    label: 'Price',
    controlType: CONTROL_TYPES.NUMBER,
    controlOptions: &#123;
      placeholder: 'Enter price',
      min: 0,
      max: 10000,
      step: 0.01,
      minFractionDigits: 2,
      maxFractionDigits: 2,
      validators: [Validators.required]
    &#125;
  &#125;
]</code></pre>

      <h4>Number Control Options</h4>
      <ul>
        <li><strong>placeholder</strong>: Placeholder text displayed when the field is empty</li>
        <li><strong>min</strong>: Minimum allowed value</li>
        <li><strong>max</strong>: Maximum allowed value</li>
        <li><strong>step</strong>: Increment/decrement step</li>
        <li><strong>minFractionDigits</strong>: Minimum number of decimal places</li>
        <li><strong>maxFractionDigits</strong>: Maximum number of decimal places</li>
      </ul>

      <h3>Input Icons</h3>
      <p>Form fields can display icons to improve user experience and provide visual context. Use the <code>inputIcon</code> property in field configuration.</p>
      <pre><code>config: [
  &#123;
    key: 'email',
    label: 'Email Address',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: &#123;
      inputIcon: 'mail',
      validators: [Validators.required, Validators.email]
    &#125;
  &#125;
]</code></pre>

      <h3>Select Button Controls</h3>
      <p>Select button controls display options as clickable buttons instead of dropdown menus.</p>
      <pre><code>config: [
  &#123;
    key: 'priority',
    label: 'Priority Level',
    controlType: CONTROL_TYPES.RADIO,
    options: [
      &#123; label: 'Low', value: 'low' &#125;,
      &#123; label: 'Medium', value: 'medium' &#125;,
      &#123; label: 'High', value: 'high' &#125;
    ],
    controlOptions: &#123;
      multipleSelectButton: true,
      isSelectButtonOptionToggleable: true
    &#125;
  &#125;
]</code></pre>

      <h4>Select Button Control Options</h4>
      <ul>
        <li><strong>multipleSelectButton</strong>: Enables multiple selection</li>
        <li><strong>isSelectButtonOptionToggleable</strong>: Allows deselecting options</li>
      </ul>

      <h3>Table Control</h3>
      <p>Table controls allow users to manage tabular data within a form, providing inline editing capabilities, filtering, sorting, and the ability to add or delete rows.</p>
      <pre><code>config: [
  &#123;
    key: 'workExperience',
    label: 'Work Experience',
    controlType: CONTROL_TYPES.TABLE,
    controlOptions: &#123;
      width: '100%',
      validators: [Validators.required],
      tableCtrlConfig: &#123;
        editionMode: 'cell',
        filterable: true,
        sortable: true,
        selectable: true,
        isCreationEnabled: true,
        isDeletionEnabled: true
      &#125;,
      tableCtrlColumns: [
        &#123;
          key: 'company',
          label: 'Company',
          controlType: CONTROL_TYPES.INPUT,
          type: INPUT_TYPES.TEXT,
          controlOptions: &#123;
            validators: [Validators.required]
          &#125;
        &#125;
      ]
    &#125;
  &#125;
]</code></pre>

      <h4>Table Control Configuration Options</h4>
      <ul>
        <li><strong>editionMode</strong>: 'cell' | 'row' - Defines how users edit table data</li>
        <li><strong>filterable</strong>: boolean - Enables filtering capabilities</li>
        <li><strong>sortable</strong>: boolean - Enables sorting for columns</li>
        <li><strong>selectable</strong>: boolean - Enables row selection</li>
        <li><strong>isCreationEnabled</strong>: boolean - Enables "Add Row" button</li>
        <li><strong>isDeletionEnabled</strong>: boolean - Enables delete buttons for rows</li>
        <li><strong>isHeaderHidden</strong>: boolean - Hides the table header</li>
        <li><strong>sortedColumnKeys</strong>: string[] - Defines column display order</li>
        <li><strong>onCellClicked</strong>: Function - Callback when cell is clicked</li>
        <li><strong>groupValidator</strong>: ValidatorFn - Row-level validation</li>
      </ul>

      <h3>Field Interactions and Actions</h3>
      <p>Form fields can trigger actions that modify other fields when specific interactions occur. Use the <code>action</code> property in <code>controlOptions</code>.</p>
      <pre><code>config: [
  &#123;
    key: 'subscription',
    label: 'Subscription Type',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      &#123; label: 'Basic', value: 'basic' &#125;,
      &#123; label: 'Premium', value: 'premium' &#125;
    ],
    controlOptions: &#123;
      action: (event) => &#123;
        switch (event.value) &#123;
          case 'basic':
            return [
              &#123; key: 'maxUsers', value: 5 &#125;,
              &#123; key: 'price', value: 9.99 &#125;
            ];
          case 'premium':
            return [
              &#123; key: 'maxUsers', value: 25 &#125;,
              &#123; key: 'price', value: 29.99 &#125;
            ];
          default:
            return undefined;
        &#125;
      &#125;
    &#125;
  &#125;
]</code></pre>

      <h2>Advanced Features</h2>

      <h3>Conditional Logic</h3>
      <p>Show/hide or enable/disable fields based on form state.</p>
      <pre><code>config: [
  &#123;
    key: 'userType',
    label: 'User Type',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      &#123; label: 'Regular', value: 'regular' &#125;,
      &#123; label: 'Admin', value: 'admin' &#125;
    ]
  &#125;,
  &#123;
    key: 'adminLevel',
    label: 'Admin Level',
    controlType: CONTROL_TYPES.SELECT,
    options: [
      &#123; label: 'Basic', value: 'basic' &#125;,
      &#123; label: 'Super', value: 'super' &#125;
    ],
    conditions: &#123;
      controlOptions: &#123;
        hidden: (&#123; model &#125;) => model.userType !== 'admin'
      &#125;
    &#125;
  &#125;
]</code></pre>

      <h3>Nested Form Groups</h3>
      <p>Create nested structures for complex forms.</p>
      <pre><code>config: [
  &#123;
    key: 'personalInfo',
    label: 'Personal Information',
    controlType: CONTROL_TYPES.GROUP,
    children: [
      &#123;
        key: 'firstName',
        label: 'First Name',
        controlType: CONTROL_TYPES.INPUT
      &#125;,
      &#123;
        key: 'lastName',
        label: 'Last Name',
        controlType: CONTROL_TYPES.INPUT
      &#125;
    ]
  &#125;
]</code></pre>

      <h3>Dynamic Validation</h3>
      <p>Apply conditional validators based on form state.</p>
      <pre><code>config: [
  &#123;
    key: 'email',
    label: 'Email',
    controlType: CONTROL_TYPES.EMAIL,
    conditions: &#123;
      controlOptions: &#123;
        validators: (&#123; model &#125;) => &#123;
          const validators = [Validators.email];
          if (model.requireEmail) &#123;
            validators.push(Validators.required);
          &#125;
          return validators;
        &#125;
      &#125;
    &#125;
  &#125;
]</code></pre>

      <h3>Custom Field Components</h3>
      <p>Create and integrate custom field components to extend form capabilities. Custom components must extend <code>FormFieldBaseComponent</code> which provides access to field configuration and the form control.</p>
      <p><strong>Key features:</strong></p>
      <ul>
        <li>Access to field configuration via <code>config()</code></li>
        <li>Access to the form control via <code>control()</code></li>
        <li>Automatic integration with the form's reactive system</li>
        <li>Full ReactiveFormsModule support</li>
      </ul>

      <p>Usage in configuration:</p>
      <pre><code>config: [
  &#123;
    key: 'model',
    label: 'Marque / Modèle',
    controlType: 'custom',
    options: [
      &#123; label: 'Modèle A', value: 'model_a' &#125;,
      &#123; label: 'Modèle B', value: 'model_b' &#125;
    ],
    controlOptions: &#123;
      customComponent: RequestCustomFieldComponent,
      styleClass: 'my-datalist-input',
      validators: [required]
    &#125;
  &#125;
]</code></pre>

      <h3>Custom Styling with styleClass</h3>
      <p>Apply custom CSS classes to individual form fields using the <code>styleClass</code> property.</p>
      <pre><code>config: [
  &#123;
    key: 'username',
    label: 'Username',
    controlType: CONTROL_TYPES.INPUT,
    controlOptions: &#123;
      styleClass: 'highlight-field required-field',
      validators: [required]
    &#125;
  &#125;
]</code></pre>

      <h2>Usage Examples</h2>

      <h3>Basic Form</h3>
      <pre><code>&lt;frm-form
  [(model)]="formData"
  [config]="formConfig"
  [showSubmit]="true"
  [showReset]="true"
  (submitted)="onFormSubmit($event)"
  (validityChange)="onValidityChange($event)"&gt;
&lt;/frm-form&gt;</code></pre>

      <h3>Multi-Column Form</h3>
      <pre><code>&lt;frm-form
  [(model)]="formData"
  [config]="formConfig"
  [columnsCount]="2"
  [showSubmit]="true"
  submitButtonLabel="Save Changes"&gt;
&lt;/frm-form&gt;</code></pre>

      <h3>Read-Only Form</h3>
      <pre><code>&lt;frm-form
  [(model)]="formData"
  [config]="viewConfig"
  [isReadonly]="true"
  [showDebug]="false"&gt;
&lt;/frm-form&gt;</code></pre>

      <h3>Form with Custom Validation</h3>
      <pre><code>&lt;frm-form
  [(model)]="formData"
  [config]="formConfig"
  [groupValidator]="validateDateRange"
  [showSubmit]="true"
  (validityChange)="formValid = $event"&gt;
&lt;/frm-form&gt;</code></pre>

      <h2>Best Practices</h2>
      <ol>
        <li><strong>Performance</strong>: Use <code>forceReload</code> sparingly as it recreates the entire form</li>
        <li><strong>Validation</strong>: Prefer field-level validation over group validation when possible</li>
        <li><strong>Conditions</strong>: Keep conditional logic simple and testable</li>
        <li><strong>Layout</strong>: Choose appropriate <code>columnsCount</code> based on field complexity</li>
        <li><strong>Accessibility</strong>: Always provide meaningful labels and error messages</li>
      </ol>
    </div>
  `,
})
export class ExampleFormTabComponent {}
