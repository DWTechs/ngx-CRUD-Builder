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
import { DomSanitizer } from "@angular/platform-browser";
import { startWith, switchMap } from "rxjs";
import { CRUD_LABELS } from "../../../../core/utils/i18n/crud-labels.token";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-rich-text-editor",
  templateUrl: "./native-rich-text-editor.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-rich-text-editor.component.scss",
  ],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeRichTextEditorComponent extends FormFieldBaseComponent {
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
