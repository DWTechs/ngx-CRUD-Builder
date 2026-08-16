export interface Adapter<T> {
  adapt(item: unknown): T;
  adaptMany(items: unknown[]): T[];
  convert(item: T): unknown;
  convertMany(items: T[]): unknown[];
}
