import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./form-demo/form-demo").then((m) => m.FormDemo),
    title: "Form Builder - Demo",
  },
  {
    path: "table",
    loadComponent: () =>
      import("./table-demo/table-demo").then((m) => m.TableDemo),
    title: "Table Builder - Demo",
  },
  {
    path: "doc",
    loadComponent: () =>
      import("./doc/doc.component").then((m) => m.DocComponent),
    title: "Form Builder - Documentation",
  },
];
