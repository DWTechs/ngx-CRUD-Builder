import { CrudItemBase } from "@crud/core/models/crud-item-base.class";

export type RequestType = "laptop" | "screen" | "smartphone" | "accessory";
export type RequestOs = "windows" | "macOS" | "linux" | "ios" | "android";
export type RequestAccessoryType =
  | "mouse"
  | "keyboard"
  | "dock"
  | "headphones"
  | "case";

export interface ItRequest extends CrudItemBase {
  id: number | null;
  type: RequestType | null;
  model: string;
  os: RequestOs | null;
  screenSize: number | null;
  accessoryType: RequestAccessoryType | null;
  desiredDate: Date | null;
  estimatedBudget: number | null;
  justification: string;
  attachment: string;
  comments: string;
  isValidated: boolean;
}

export const itRequestFactory: () => ItRequest = () => ({
  id: null,
  type: null,
  model: "",
  os: null,
  screenSize: null,
  accessoryType: null,
  desiredDate: null,
  estimatedBudget: null,
  justification: "",
  attachment: "",
  comments: "",
  isValidated: false,
  archived: false,
  archivedAt: null,
});
