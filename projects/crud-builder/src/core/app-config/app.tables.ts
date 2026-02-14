import { FilterLevel } from "@crud/core/utils/table/filter-level.model";

const tableKeys = [
  "events",
  "users",
  "products",
  "clients",
  "obsoWarnings",
  "passwordPolicies",
  "documents",
  "routes",
  "consumers",
] as const; // Extend as needed

type AppTable = (typeof tableKeys)[number];

type TableInfo = {
  label: string;
  title: string;
  key: AppTable;
  functionalityKey: string;
  selectable: boolean;
  isExcelExportEnabled: boolean;
  lazy: boolean;
  clickableRows: boolean;
  protectDeletion: boolean;
  canAccessItemFromUrl: boolean;
  filterLevel: FilterLevel;
};

export const TABLES: Record<AppTable, TableInfo> = {
  events: {
    label: $localize`:@@TableLabels_Event:Evènement`,
    title: $localize`:@@TableLabels_Events:Evènements`,
    key: "events",
    functionalityKey: "events",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  users: {
    label: $localize`:@@TableLabels_User:Utilisateur`,
    title: $localize`:@@TableLabels_Users:Utilisateurs`,
    key: "users",
    functionalityKey: "users",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  products: {
    label: $localize`:@@TableLabels_Product:Produit`,
    title: $localize`:@@TableLabels_Products:Produits`,
    key: "products",
    functionalityKey: "products",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  clients: {
    label: $localize`:@@TableLabels_Client:Client`,
    title: $localize`:@@TableLabels_Clients:Clients`,
    key: "clients",
    functionalityKey: "shop",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  obsoWarnings: {
    label: $localize`:@@TableLabels_ObsoWarning:Alerte obsolescence`,
    title: $localize`:@@TableLabels_ObsoWarnings:Alertes obsolescence`,
    key: "obsoWarnings",
    functionalityKey: "obso-warnings",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  passwordPolicies: {
    label: $localize`:@@TableLabels_PasswordPolicy:Politique de mot de passe`,
    title: $localize`:@@TableLabels_PasswordPolicies:Politiques de mot de passe`,
    key: "passwordPolicies",
    functionalityKey: "passwords",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: true,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  documents: {
    label: $localize`:@@TableLabels_Document:Document`,
    title: $localize`:@@TableLabels_Documents:Documents`,
    key: "documents",
    functionalityKey: "documents",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    protectDeletion: false,
    canAccessItemFromUrl: true,
    filterLevel: "advanced",
  },
  routes: {
    label: $localize`:@@TableLabels_Route:Route`,
    title: $localize`:@@TableLabels_Routes:Routes`,
    key: "routes",
    functionalityKey: "routes",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: false,
    clickableRows: false,
    protectDeletion: false,
    canAccessItemFromUrl: false,
    filterLevel: "advanced",
  },
  consumers: {
    label: $localize`:@@TableLabels_Consumer:Consumer`,
    title: $localize`:@@TableLabels_Consumers:Consumers`,
    key: "consumers",
    functionalityKey: "consumers",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: false,
    clickableRows: false,
    protectDeletion: false,
    canAccessItemFromUrl: false,
    filterLevel: "advanced",
  },
} as const;
