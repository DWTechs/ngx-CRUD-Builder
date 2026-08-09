import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "@openng/optimus-ui/button";
import { Editor, EditorModule } from "@openng/optimus-ui/editor";
import { CRUD_LABELS } from "../../../../core/utils/i18n/crud-labels.token";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-rich-text-editor",
  templateUrl: "./rich-text-editor.component.html",
  styleUrls: ["./rich-text-editor.component.scss"],
  imports: [EditorModule, ReactiveFormsModule, NgTemplateOutlet, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent extends FormFieldBaseComponent {
  protected readonly labels = inject(CRUD_LABELS);
  @ViewChild("editorComponent") editorComponent!: Editor;
  @ViewChild("htmlEditor") htmlEditor!: ElementRef;

  public modules = {
    // syntax: true // commented for now
    clipboard: {
      matchVisual: false, // strip out the unnecessarily-injected <p><br></p>
    },
  };
  public htmlToggled = false;

  public toggleHTML(): void {
    this.htmlToggled = !this.htmlToggled;
    const quill = this.editorComponent.quill;
    if (this.htmlToggled) {
      const HTML =
        this.editorComponent.el.nativeElement.querySelector(
          ".ql-editor",
        ).innerHTML;
      this.htmlEditor.nativeElement.innerText = HTML;
    } else {
      const newHTML = this.htmlEditor.nativeElement.value;
      quill.pasteHTML(newHTML);
    }
  }
}
