import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { RequestsService } from "./full-example/data-access/requests.service";

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
  {
    path: "full-example",
    loadComponent: () =>
      import("./full-example/features/requests").then(
        (m) => m.RequestsComponent,
      ),
    title: $localize`:@@ToolsNav_Requests:Demandes`,
    resolve: {
      types: () => inject(RequestsService).getTypes(),
      osOptions: () => inject(RequestsService).getOsOptions(),
      accessoryTypes: () => inject(RequestsService).getAccessoryTypes(),
    },
    data: {
      breadcrumb: $localize`:@@ToolsNav_Requests:Demandes`,
    },
  },
];
