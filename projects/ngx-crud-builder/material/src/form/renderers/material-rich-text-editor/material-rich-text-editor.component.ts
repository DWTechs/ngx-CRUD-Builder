import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  SecurityContext,
  signal,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DomSanitizer } from "@angular/platform-browser";
import { CRUD_LABELS, FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";
import { startWith, switchMap } from "rxjs";

@Component({
  selector: "frm-material-rich-text-editor",
  template: `
    <div class="editor-shell" [class.disabled]="isReadonly()">
      <mat-toolbar class="editor-toolbar">
        <button
          mat-icon-button
          type="button"
          aria-label="Bold"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('bold')"
        ><b>B</b></button>
        <button
          mat-icon-button
          type="button"
          aria-label="Italic"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('italic')"
        ><i>I</i></button>
        <button
          mat-icon-button
          type="button"
          aria-label="Underline"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('underline')"
        ><u>U</u></button>
        <button
          mat-icon-button
          type="button"
          aria-label="Strikethrough"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('strikeThrough')"
        ><s>S</s></button>
        <button
          mat-icon-button
          type="button"
          aria-label="Ordered list"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('insertOrderedList')"
        >1.</button>
        <button
          mat-icon-button
          type="button"
          aria-label="Bullet list"
          [disabled]="isReadonly() || htmlToggled()"
          (click)="exec('insertUnorderedList')"
        >&#8226;</button>
        @if (options().isHtmlToggleable) {
          <button
            mat-icon-button
            type="button"
            [disabled]="isReadonly()"
            [title]="labels.richTextEditor.editHtml"
            (click)="toggleHtml()"
          >&lt;/&gt;</button>
        }
      </mat-toolbar>

      @if (htmlToggled()) {
        <textarea
          class="html-editor"
          [style.height]="editorHeight()"
          [formControl]="control()"
          (input)="emitInteractionEvent('keyup')"
          (focus)="emitInteractionEvent('focus')"
          (blur)="emitInteractionEvent('blur')"
        ></textarea>
      } @else {
        <div
          #editor
          class="editor-content"
          role="textbox"
          aria-multiline="true"
          [attr.aria-label]="label()"
          [style.height]="editorHeight()"
          [attr.contenteditable]="!isReadonly()"
          (input)="onEditorInput()"
          (focus)="emitInteractionEvent('focus')"
          (blur)="emitInteractionEvent('blur')"
        ></div>
      }
    </div>
  `,
  styles: `
    .editor-shell {
      border: 1px solid var(--mat-sys-outline, rgba(0, 0, 0, 0.38));
      border-radius: 4px;
      overflow: hidden;
    }
    .editor-shell.disabled {
      opacity: 0.6;
    }
    .editor-toolbar {
      height: auto;
      min-height: 0;
      padding: 4px 8px;
      gap: 2px;
      border-bottom: 1px solid var(--mat-sys-outline-variant, rgba(0, 0, 0, 0.12));
    }
    .editor-content,
    .html-editor {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      overflow-y: auto;
    }
    .editor-content:focus {
      outline: none;
    }
    .html-editor {
      border: 0;
      resize: vertical;
      font-family: monospace;
    }
    .html-editor:focus {
      outline: none;
    }
  `,
  imports: [ReactiveFormsModule, MatButtonModule, MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialRichTextEditorComponent extends FormFieldBaseComponent {
  protected readonly labels = inject(CRUD_LABELS);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly editor = viewChild<ElementRef<HTMLDivElement>>("editor");

  private readonly controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: "" },
  );

  protected readonly htmlToggled = signal(false);

  protected readonly isReadonly = computed(
    () => this.isDisabled() || !!this.isFormReadonly(),
  );

  protected readonly editorHeight = computed(
    () => this.options().textEditorHeight || "200px",
  );

  // pushes external value changes into the contenteditable; skipped while the user
  // types because onEditorInput() already keeps the control in sync
  protected readonly syncEditor = effect(() => {
    const value = (this.controlValue() as string) ?? "";
    const el = this.editor()?.nativeElement;
    if (!el || el.innerHTML === value) return;
    el.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, value) ?? "";
  });

  protected exec(command: string): void {
    if (this.isReadonly()) return;
    const el = this.editor()?.nativeElement;
    if (!el) return;
    el.focus();
    document.execCommand(command);
    this.onEditorInput();
  }

  protected toggleHtml(): void {
    this.htmlToggled.update((toggled) => !toggled);
  }

  protected onEditorInput(): void {
    const el = this.editor()?.nativeElement;
    if (!el) return;
    this.control().setValue(el.innerHTML);
    this.control().markAsDirty();
    this.emitInteractionEvent("keyup");
  }
}
