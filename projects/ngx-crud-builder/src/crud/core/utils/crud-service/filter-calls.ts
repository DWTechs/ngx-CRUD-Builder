import { Calls, CallsPermissions } from "./crud.model";

/**
 * Filters a Calls object based on a permissions object.
 * Read operations (get, getById, getAll, getHistory...) are always preserved.
 * Designed to be used inside a `computed()` for signal-based reactivity.
 *
 * @example
 * public readonly httpCalls = computed(() =>
 *   filterCalls(this.service.httpCalls, {
 *     canCreate: this.acls.canWrite(),
 *     canUpdate: this.acls.canWrite(),
 *     canArchive: this.acls.canDelete(),
 *   })
 * );
 */
export function filterCalls<T>(
  calls: Calls<T>,
  permissions: CallsPermissions,
): Calls<T> {
  return {
    ...calls,
    create: permissions.canCreate !== false ? calls.create : undefined,
    update: permissions.canUpdate !== false ? calls.update : undefined,
    archive: permissions.canArchive !== false ? calls.archive : undefined,
    restore: permissions.canRestore !== false ? calls.restore : undefined,
  };
}
