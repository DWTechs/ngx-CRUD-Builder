import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemBase } from "../../../core/models/crud-item-base.class";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { FileInfo } from "../../../form/ui/renderers-optimus-ui/file-upload-input/file-info.class";
import { extractUploadedFiles } from "./extract-uploaded-files.utils";

class TestEntity extends CrudItemBase {
  name = "";
  pictures: FileInfo[] = [];
  documents: FileInfo[] = [];
}

describe("extractUploadedFiles", () => {
  const config: CrudItemOptions[] = [
    { key: "name", label: "Name", controlType: CONTROL_TYPES.INPUT },
    { key: "pictures", label: "Pictures", controlType: CONTROL_TYPES.FILES },
  ];

  const createFileInfo = (file?: File): FileInfo =>
    ({ file }) as unknown as FileInfo;

  it("should extract File instances from a FILES control", () => {
    const file = new File(["content"], "photo.png");
    const entry = new TestEntity();
    entry.pictures = [createFileInfo(file)];

    const files = extractUploadedFiles(config, entry);

    expect(files).toEqual([file]);
  });

  it("should ignore entries without an actual File instance", () => {
    const entry = new TestEntity();
    entry.pictures = [createFileInfo(undefined)];

    const files = extractUploadedFiles(config, entry);

    expect(files).toEqual([]);
  });

  it("should return an empty array when the FILES control value is not an array", () => {
    const entry = new TestEntity();
    entry.pictures = undefined as unknown as FileInfo[];

    const files = extractUploadedFiles(config, entry);

    expect(files).toEqual([]);
  });

  it("should return an empty array when there is no FILES control in the config", () => {
    const noFilesConfig: CrudItemOptions[] = [
      { key: "name", label: "Name", controlType: CONTROL_TYPES.INPUT },
    ];
    const entry = new TestEntity();

    const files = extractUploadedFiles(noFilesConfig, entry);

    expect(files).toEqual([]);
  });

  it("should extract and flatten files from multiple FILES controls", () => {
    const multiControlConfig: CrudItemOptions[] = [
      ...config,
      {
        key: "documents",
        label: "Documents",
        controlType: CONTROL_TYPES.FILES,
      },
    ];
    const picture = new File(["content"], "photo.png");
    const document = new File(["content"], "doc.pdf");
    const entry = new TestEntity();
    entry.pictures = [createFileInfo(picture)];
    entry.documents = [createFileInfo(document)];

    const files = extractUploadedFiles(multiControlConfig, entry);

    expect(files).toEqual([picture, document]);
  });

  it("should extract multiple files from a single FILES control", () => {
    const fileA = new File(["a"], "a.png");
    const fileB = new File(["b"], "b.png");
    const entry = new TestEntity();
    entry.pictures = [createFileInfo(fileA), createFileInfo(fileB)];

    const files = extractUploadedFiles(config, entry);

    expect(files).toEqual([fileA, fileB]);
  });
});
