import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import {
  CRUD_LABELS,
  DownloadService,
  FileInfo,
  FormFieldBaseComponent,
  SnackbarService,
} from "@dwtechs/ngx-crud-builder";

@Component({
  selector: "frm-material-file-upload-input",
  templateUrl: "./material-file-upload-input.component.html",
  styleUrl: "./material-file-upload-input.component.scss",
  imports: [MatButtonModule, MatListModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialFileUploadInputComponent extends FormFieldBaseComponent {
  private readonly dlService = inject(DownloadService);
  private readonly snackbarService = inject(SnackbarService);
  protected readonly labels = inject(CRUD_LABELS);

  private readonly isImage = computed(
    () =>
      this.config().controlType === "files" &&
      this.options().mediaType === "image",
  );

  protected readonly isReadonly = computed(
    () => this.isDisabled() || !!this.isFormReadonly(),
  );

  protected readonly accept = computed(() => {
    const mediaType = this.options().mediaType;
    if (!mediaType) return "";
    if (mediaType.startsWith(".")) return mediaType;
    return `${mediaType}/*`;
  });

  protected readonly canAddMore = computed(() =>
    this.options().multiple ? true : this.localFiles().length === 0,
  );

  protected readonly localFiles = linkedSignal<FileInfo[]>(() => {
    if (this.control().value) {
      return this.control().value as FileInfo[];
    }
    return [];
  });

  protected readonly infoTitle = computed(() => {
    const parts: string[] = [];
    const maxFileSize = this.options().maxFileSize;
    if (maxFileSize) {
      parts.push(`Taille maximum : ${maxFileSize / 1_000_000} Mb`);
    }
    const mediaType = this.options().mediaType;
    if (mediaType) {
      parts.push(`Type de média : ${mediaType}`);
    }
    parts.push(
      this.canAddMore()
        ? this.labels.fileUpload.canAddMore
        : this.labels.fileUpload.cannotAddMore,
    );
    return parts.join("\n");
  });

  protected readonly constraintsHint = computed(() => {
    const { maxFileSize, mediaType } = this.options();
    const parts: string[] = [];
    if (maxFileSize) {
      parts.push(`Taille maximum : ${maxFileSize / 1_000_000} Mb`);
    }
    if (mediaType) {
      parts.push(`Type de média : ${mediaType}`);
    }
    return parts.join(" · ");
  });

  protected readonly isDraggedOver = signal(false);

  protected readonly previewedFile = signal<FileInfo | null>(null);

  protected canPreview(file: FileInfo): boolean {
    return (
      !!this.options().isPreviewEnabled &&
      (file.isImage || this.options().mediaType === "image")
    );
  }

  protected openPreview(file: FileInfo, dialog: HTMLDialogElement): void {
    this.previewedFile.set(file);
    dialog.showModal();
  }

  protected async onFileUploaded(fileInput: HTMLInputElement): Promise<void> {
    const validatedFilesList = await this.validateFilesList(fileInput.files);
    if (!validatedFilesList.length) return;
    if (!this.options().multiple) {
      for (const f of this.localFiles()) {
        f.revoke();
      }
    }
    const files = this.options().multiple
      ? this.localFiles().concat(validatedFilesList)
      : validatedFilesList;
    this.localFiles.set(files);
    this.setControlValue();
    this.emitInteractionEvent("uploadFile", this.localFiles());
  }

  protected onDrop(event: DragEvent, fileInput: HTMLInputElement): void {
    this.isDraggedOver.set(false);
    this.prevent(event);
    if (this.isReadonly() || !event.dataTransfer) return;
    fileInput.files = event.dataTransfer.files;
    this.onFileUploaded(fileInput);
  }

  protected onDragOver(event: DragEvent): void {
    this.isDraggedOver.set(true);
    this.prevent(event);
  }

  protected onDragLeave(event: DragEvent): void {
    this.isDraggedOver.set(false);
    this.prevent(event);
  }

  protected clearAll(fileInput: HTMLInputElement): void {
    for (const f of this.localFiles()) {
      f.revoke();
    }
    this.localFiles.set([]);
    this.emitInteractionEvent("clearAllFiles");
    fileInput.value = "";
    this.setControlValue();
  }

  protected clear(index: number, fileInput: HTMLInputElement): void {
    this.localFiles()[index]?.revoke();
    this.localFiles.update((f) => f.filter((_, i) => i !== index));
    this.emitInteractionEvent("clearFile", index);
    fileInput.value = "";
    this.setControlValue();
  }

  protected prevent(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDownload(file: FileInfo): void {
    if (file.file) {
      const blob = new Blob([file.file], { type: file.file.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      this.dlService.tryDownloadFile(file.src, file.name, false).subscribe();
    }
  }

  private setControlValue(): void {
    this.control().setValue(this.localFiles());
  }

  private async validateFilesList(
    filesList: FileList | null,
  ): Promise<FileInfo[]> {
    if (!filesList?.length) return [];
    const files: FileInfo[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const maxFileSize = this.options().maxFileSize;
      if (maxFileSize && file.size > maxFileSize) {
        const message = this.labels.fileUpload.maxFileSizeExceeded(
          file.name,
          maxFileSize,
        );
        this.snackbarService.displayError(message);
        this.control().setErrors({ maxFileSize: true });
        this.control().markAsTouched();
      } else {
        const fileInfo = await this.readLocalFile(file);
        files.push(fileInfo);
      }
    }
    return files;
  }

  private readLocalFile(file: File): Promise<FileInfo> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      if (this.isImage()) {
        reader.readAsDataURL(file as Blob);
      } else {
        reader.readAsText(file as Blob, "utf8");
      }
      reader.onload = () => {
        const fileInfo = new FileInfo({
          type: "local",
          file,
          src: reader.result as string,
        });
        resolve(fileInfo);
      };
    });
  }
}
