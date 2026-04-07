import { InjectionToken } from "@angular/core";
import { CallsPermissions } from "./crud.model";

/**
 * Contract that any ACL adapter must fulfill to integrate with `filterCalls`.
 * The implementation can be backed by any access-control system
 * (role-based, scope-based, feature flags, etc.).
 */
export interface AclAdapter {
  permissionsFor(functionality: string | undefined): CallsPermissions;
}

/**
 * Injection token for the ACL adapter.
 * The default implementation grants all permissions (open access).
 *
 * @example — provide your own implementation in app.config.ts:
 * providers: [
 *   { provide: ACL_ADAPTER, useExisting: AclService }
 * ]
 */
export const ACL_ADAPTER = new InjectionToken<AclAdapter>("ACL_ADAPTER", {
  factory: () => ({
    permissionsFor: () => ({
      canCreate: true,
      canUpdate: true,
      canArchive: true,
      canRestore: true,
    }),
  }),
});
