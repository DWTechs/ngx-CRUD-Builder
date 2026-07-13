import { Injectable, signal } from "@angular/core";
import { AclAdapter } from "@crud/core/utils/crud-service/acl-adapter";
import {
  Calls,
  CallsPermissions,
} from "@crud/core/utils/crud-service/crud.model";

type Acls = {
  [functionalityKey: string]: {
    [featureKey in keyof Calls<unknown>]: boolean;
  };
};

@Injectable({ providedIn: "root" })
export class AclService implements AclAdapter {
  private _accessLevels = signal<Acls>({});
  public readonly accessLevels = this._accessLevels.asReadonly();

  private readonly _areAclResolved = signal(false);
  public readonly areAclResolved = this._areAclResolved.asReadonly();

  public permissionsFor(functionality: string | undefined): CallsPermissions {
    return {
      canCreate: this.hasAccess(functionality, "create"),
      canUpdate: this.hasAccess(functionality, "update"),
      canArchive: this.hasAccess(functionality, "archive"),
      canRestore: this.hasAccess(functionality, "restore"),
    };
  }

  public storeAccessLevels(acls: Acls): void {
    if (Object.keys(this._accessLevels()).length) return;
    this._accessLevels.set(acls);
    this._areAclResolved.set(true);
  }

  public resetAccessLevels(): void {
    this._accessLevels.set({});
    this._areAclResolved.set(false);
  }

  private hasAccess(
    functionality: string | undefined,
    operation: keyof Calls<unknown> | undefined,
  ): boolean {
    if (!functionality) return true;
    const funcAcls = this.accessLevels()[functionality];
    if (!funcAcls) return false;
    if (operation) return funcAcls[operation as keyof typeof funcAcls] || false;
    return funcAcls.get || false;
  }
}
