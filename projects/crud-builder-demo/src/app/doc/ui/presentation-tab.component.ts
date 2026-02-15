import { Component } from "@angular/core";

@Component({
  selector: "doc-presentation-tab",
  standalone: true,
  template: `
    <div class="doc-content">     
      <p class="lead">
        A configuration-driven Angular library for building CRUD interfaces with dynamic forms and data tables.
      </p>

      <h2>Overview</h2>
      
      <p>
        CRUD Builder provides two main components that work together to handle create, read, update, 
        and delete operations through a declarative configuration approach. The library eliminates 
        repetitive boilerplate code by generating forms and tables from configuration objects.
      </p>

      <h2>Core Components</h2>

      <h3>FormComponent</h3>
      <p>
        A dynamic form generator that creates reactive Angular forms based on configuration arrays. 
        It handles form validation, conditional logic, nested structures, and supports 15+ field types 
        including text inputs, dropdowns, date pickers, file uploads, and rich text editors.
      </p>

      <h3>TableComponent</h3>
      <p>
        A data table component with integrated CRUD operations. Features include server-side and 
        client-side pagination, column sorting and filtering, bulk actions, row selection, and 
        data export capabilities. The table automatically generates dialogs for create and edit 
        operations using the same configuration as the form component.
      </p>

      <h2>Key Features</h2>

      <ul>
        <li><strong>Configuration-driven:</strong> Define your data structure once and use it for both forms and tables</li>
        <li><strong>Type-safe:</strong> Full TypeScript support with comprehensive type definitions</li>
        <li><strong>Reactive forms:</strong> Built on Angular's reactive forms for proper validation and state management</li>
        <li><strong>PrimeNG integration:</strong> Uses PrimeNG components for consistent UI/UX</li>
        <li><strong>Conditional logic:</strong> Show or hide fields based on form values with declarative conditions</li>
        <li><strong>Nested structures:</strong> Support for complex nested objects and arrays</li>
        <li><strong>Custom rendering:</strong> Extend default behavior with custom templates and renderers</li>
        <li><strong>Internationalization:</strong> Built-in support for multi-language applications</li>
      </ul>

      <h2>Supported Field Types</h2>

      <div class="field-types">
        <div class="field-group">
          <h4>Basic Inputs</h4>
          <ul>
            <li>Text input (with various HTML5 types)</li>
            <li>Number input</li>
            <li>Textarea</li>
            <li>Checkbox</li>
            <li>Date picker</li>
          </ul>
        </div>

        <div class="field-group">
          <h4>Selection Controls</h4>
          <ul>
            <li>Dropdown (single select)</li>
            <li>Multi-select</li>
            <li>Autocomplete with search</li>
            <li>Radio buttons</li>
            <li>Select buttons</li>
            <li>Picklist (dual list)</li>
          </ul>
        </div>

        <div class="field-group">
          <h4>Advanced</h4>
          <ul>
            <li>File upload (single/multiple)</li>
            <li>Rich text editor (WYSIWYG)</li>
            <li>Nested tables</li>
            <li>Custom components</li>
            <li>Form groups</li>
          </ul>
        </div>
      </div>

      <h2>Use Cases</h2>

      <p>
        This library is particularly suited for administrative interfaces, back-office applications, 
        and internal tools where rapid development and maintainability are priorities. The 
        configuration-driven approach reduces the amount of template code while maintaining 
        flexibility for customization when needed.
      </p>

      <h2>Technical Requirements</h2>

      <ul>
        <li>Angular 21+</li>
        <li>PrimeNG 21+</li>
        <li>RxJS 7+</li>
        <li>TypeScript 5+</li>
      </ul>
    </div>
  `,
})
export class PresentationTabComponent {}
