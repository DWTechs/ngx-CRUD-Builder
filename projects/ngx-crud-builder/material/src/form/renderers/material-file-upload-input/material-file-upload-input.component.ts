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
  template: `
    <input
      #fileInput
      hidden
      type="file"
      [id]="'file-upload-' + config().key"
      [accept]="accept()"
      [multiple]="!!options().multiple"
      [disabled]="isReadonly()"
      (change)="onFileUploaded(fileInput)"
    />

    <div
      class="upload-zone"
      [class.disabled]="isReadonly()"
      [class.dragged-over]="isDraggedOver()"
      (drop)="onDrop($event, fileInput)"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (dragenter)="prevent($event)"
    >
      <p class="upload-hint" [title]="infoTitle()">
        {{ labels.fileUpload.dragDropLabel }}
      </p>
      <div class="upload-actions">
        <button
          mat-stroked-button
          type="button"
          [disabled]="isReadonly() || !canAddMore()"
          (click)="fileInput.click()"
        >
          {{ labels.fileUpload.chooseFile }}
        </button>
        <button
          mat-button
          type="button"
          [disabled]="isReadonly() || !localFiles().length"
          (click)="clearAll(fileInput)"
        >
          &#10005;
        </button>
      </div>
    </div>

    @if (localFiles().length) {
      <mat-list class="uploaded-files">
        <div mat-subheader>{{ labels.fileUpload.uploadedFilesTitle }}</div>
        @for (file of localFiles(); track file; let i = $index) {
          <mat-list-item>
            <span matListItemTitle>{{ file.file?.name || file.name }}</span>
            <span matListItemMeta class="file-actions">
              <button
                mat-icon-button
                type="button"
                [attr.aria-label]="labels.fileUpload.uploadedFilesTitle"
                (click)="onDownload(file)"
              >
                &#11015;
              </button>
              <button
                mat-icon-button
                type="button"
                [disabled]="isReadonly()"
                (click)="clear(i, fileInput)"
              >
                &#10005;
              </button>
            </span>
          </mat-list-item>
        }
      </mat-list>
    }
  `,
  styles: `
    .upload-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      border: 1px dashed var(--mat-sys-outline, rgba(0, 0, 0, 0.38));
      border-radius: 4px;
    }
    .upload-zone.dragged-over {
      border-color: var(--mat-sys-primary, #3f51b5);
    }
    .upload-zone.disabled {
      opacity: 0.6;
    }
    .upload-hint {
      margin: 0;
    }
    .upload-actions,
    .file-actions {
      display: flex;
      gap: 4px;
    }
  `,
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

  protected readonly isDraggedOver = signal(false);

  protected async onFileUploaded(fileInput: HTMLInputElement): Promise<void> {
    const validatedFilesList = await this.validateFilesList(fileInput.files);
    if (!validatedFilesList.length) return;
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
    this.localFiles.set([]);
    this.emitInteractionEvent("clearAllFiles");
    fileInput.value = "";
    this.setControlValue();
  }

  protected clear(index: number, fileInput: HTMLInputElement): void {
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
