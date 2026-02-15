import { Injectable, signal } from "@angular/core";

type AccessLevels = Map<string, number>;
const initialAccessLevels: AccessLevels = new Map<string, number>();

@Injectable({ providedIn: "root" })
export class AccessLevelsService {
  private _accessLevels = signal<AccessLevels>(initialAccessLevels);
  public readonly accessLevels = this._accessLevels.asReadonly();

  private readonly _areAclResolved = signal(false);
  public readonly areAclResolved = this._areAclResolved.asReadonly();

  public userHasAccess(): boolean {
    return true; // MOCKED FOR DEMO
  }

  public storeAccessLevels(): void {
    const userAccessMap: AccessLevels = new Map<string, number>(); // MOCKED FOR DEMO
    this._accessLevels.set(userAccessMap);
    this._areAclResolved.set(true);
  }

  public resetAccessLevels(): void {
    this._accessLevels.update((acl) => {
      acl.clear();
      return acl;
    });
  }
}
