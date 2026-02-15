import { InjectionToken } from "@angular/core";

export interface AppConfig {
  title: string;
  appKey: string;
  storageKeys: { [key: string]: string };
  apiPrefix: string;
}

const defaultValue: AppConfig = {
  title: "",
  appKey: "",
  storageKeys: {},
  apiPrefix: "/api/",
};

export const APP_CONFIG = new InjectionToken<AppConfig>("APP_CONFIG", {
  providedIn: "root",
  factory: () => defaultValue,
});
