const IMAGE_EXTENSION_REGEX = /\.(png|jpe?g|gif|webp|svg|bmp|avif)([?#]|$)/i;

type FileInfoBuilder =
  | { type: "local"; file: File; src: string }
  | { type: "server"; src: string };

export class FileInfo {
  src = "";
  file?: File;

  constructor(fileInfoBuilder: FileInfoBuilder) {
    if (fileInfoBuilder.type === "server") {
      this.src = fileInfoBuilder.src;
    } else {
      this.src = URL.createObjectURL(fileInfoBuilder.file);
      this.file = fileInfoBuilder.file;
    }
  }

  get name() {
    return typeof this.src === "string"
      ? // Extract last part of src
        this.src.substring(this.src.lastIndexOf("/") + 1)
      : // Get name from file
        this.file?.name || "";
  }

  get isImage(): boolean {
    if (this.file) {
      return this.file.type.startsWith("image/");
    }
    return IMAGE_EXTENSION_REGEX.test(this.src);
  }

  /** Human readable size, empty for server files whose size is unknown */
  get sizeLabel(): string {
    const size = this.file?.size;
    if (size === undefined) {
      return "";
    }
    if (size < 1000) {
      return `${size} B`;
    }
    if (size < 1_000_000) {
      return `${(size / 1000).toFixed(1)} KB`;
    }
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }

  /** Release the blob URL created for a local file */
  revoke(): void {
    if (this.file) {
      URL.revokeObjectURL(this.src);
    }
  }
}
