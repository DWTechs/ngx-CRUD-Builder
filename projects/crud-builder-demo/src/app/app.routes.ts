import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./demo/form-demo.routes").then((m) => m.FORM_DEMO_ROUTES),
    title: "Démo formulaires",
    data: {
      breadcrumb: $localize`:@@FormDemo_formDemoNav:Démo`,
    },
  },
  {
    path: "doc",
    loadComponent: () =>
      import("./doc/doc.component").then((m) => m.DocComponent),
    title: "Documentation",
  },
];
