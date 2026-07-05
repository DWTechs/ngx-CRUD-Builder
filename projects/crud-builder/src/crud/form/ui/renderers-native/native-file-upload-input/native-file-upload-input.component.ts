import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
} from "@angular/core";
import { SnackbarService } from "../../../../../core/utils/snackbar/snackbar.service";
import { DownloadService } from "../../../../core/utils/download/download.service";
import { CRUD_LABELS } from "../../../../core/utils/i18n/crud-labels.token";
import { FileInfo } from "../../renderers-primeng/file-upload-input/file-info.class";
import { FileNamePipe } from "../../renderers-primeng/file-upload-input/file-name.pipe";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-native-file-upload-input",
  templateUrl: "./native-file-upload-input.component.html",
  styleUrls: ["./native-file-upload-input.component.scss"],
  imports: [FileNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeFileUploadInputComponent extends FormFieldBaseComponent {
  private readonly dlService = inject(DownloadService);
  private readonly snackbarService = inject(SnackbarService);
  protected readonly labels = inject(CRUD_LABELS);

  private readonly isImage = computed(
    () =>
      this.config().controlType === "files" &&
      this.options().mediaType === "image",
  );

  public readonly accept = computed(() => {
    const mediaType = this.options().mediaType;
    if (!mediaType) return "";
    if (mediaType.startsWith(".")) return mediaType;
    return `${mediaType}/*`;
  });

  public readonly canAddMore = computed(() => {
    return this.options().multiple ? true : this.localFiles().length === 0;
  });

  public readonly localFiles = linkedSignal<FileInfo[]>(() => {
    if (this.control().value) {
      return this.control().value as FileInfo[];
    }
    return [];
  });

  public readonly infoTitle = computed(() => {
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

  public isDraggedOver = false;

  public async onFileUploaded(fileInput: HTMLInputElement) {
    const filesList: FileList | null = fileInput.files;
    const validatedFilesList = await this.validateFilesList(filesList);
    if (!validatedFilesList.length) return;
    const files = this.options().multiple
      ? this.localFiles().concat(validatedFilesList)
      : validatedFilesList;
    this.localFiles.set(files);
    this.setControlValue();
    this.emitInteractionEvent("uploadFile", this.localFiles());
  }

  public onDrop(event: DragEvent, fileInput: HTMLInputElement): void {
    if (!event.dataTransfer) return;
    fileInput.files = event.dataTransfer.files;
    this.isDraggedOver = false;
    this.onFileUploaded(fileInput);
    this.prevent(event);
  }

  public onDragOver(event: DragEvent): void {
    this.isDraggedOver = true;
    this.prevent(event);
  }

  public onDragLeave(event: DragEvent): void {
    this.isDraggedOver = false;
    this.prevent(event);
  }

  public clearAll(fileInput: HTMLInputElement): void {
    this.localFiles.set([]);
    this.emitInteractionEvent("clearAllFiles");
    fileInput.value = "";
    this.setControlValue();
  }

  public clear(index: number, fileInput: HTMLInputElement): void {
    this.localFiles.update((f) => f.filter((_, i) => i !== index));
    this.emitInteractionEvent("clearFile", index);
    fileInput.value = "";
    this.setControlValue();
  }

  public prevent(event: DragEvent): void {
    event.preventDefault();
  }

  public onDownload(file: FileInfo): void {
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
