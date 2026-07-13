import { TableLazyLoadEvent } from "primeng/table";
import { Observable } from "rxjs";
import { ExcelParams } from "../../models/excel.model";
import { Rows, RowsAndCount } from "./dto.model";

type CrudGetParams = TableLazyLoadEvent & {
  excel?: ExcelParams;
};

export interface Repository<T> {
  get: (e: CrudGetParams) => Observable<RowsAndCount<T>>;
  getById: (id: number) => Observable<RowsAndCount<T>>;
  getAll: () => Observable<RowsAndCount<T>>;
  getAndCacheAll: () => Observable<T[]>;
  create: (args: T) => Observable<Rows<T>>;
  update: (args: T) => Observable<Rows<T>>;
  archive: (args: number[]) => Observable<null>;
  updateFiles: (files: File[], id: number) => Observable<Rows<T>>;
  restore: (args: number[]) => Observable<null>;
  getHistory: (id: number) => Observable<RowsAndCount<unknown>>;
}

export type Calls<T> = Partial<Repository<T>>;

/**
 * Permissions object to restrict which write operations are available.
 * Read operations (get, getById, getAll, getHistory...) are always preserved.
 * Set a permission to `false` to remove the corresponding call.
 */
export interface CallsPermissions {
  canCreate?: boolean;
  canUpdate?: boolean;
  canArchive?: boolean;
  canRestore?: boolean;
}

export interface FileOperationConfig<T> {
  filePropertyKey?: string;
  apiSuffix?: string;
  serializer?: (item: T) => FormData;
}

export interface CrudRepositoryConfig<T = any> {
  endpoint: string;
  fileOperationsConfig?: FileOperationConfig<T>;
}
