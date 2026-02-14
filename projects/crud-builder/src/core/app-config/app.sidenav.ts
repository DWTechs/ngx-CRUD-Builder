import { AppPaths } from "app/app.routes";
import { MenuItem } from "primeng/api";

export const SIDENAV: MenuItem[] = [
  {
    id: AppPaths.HOME,
    label: $localize`:@@Home_homeNav:Accueil`,
    routerLink: `/${AppPaths.HOME}`,
    icon: "pi pi-home",
  },
  {
    id: AppPaths.EVENTS,
    label: $localize`:@@Events_EventsNav:Evènements`,
    routerLink: `/${AppPaths.EVENTS}/events`,
    icon: "pi pi-calendar",
    data: {
      functionality: "events",
    },
    items: [
      {
        id: "events",
        label: $localize`:@@Events_EventsNav:Evènements`,
        routerLink: `/${AppPaths.EVENTS}/events`,
        icon: "pi pi-calendar",
      },
      {
        id: "agenda",
        label: $localize`:@@Events_AgendaNav:Agenda`,
        routerLink: `/${AppPaths.EVENTS}/agenda`,
        icon: "pi pi-calendar-plus",
      },
    ],
  },
  {
    id: AppPaths.SHOP,
    label: $localize`:@@Shop_ShopNav:Boutique`,
    routerLink: `/${AppPaths.SHOP}/clients`,
    icon: "pi pi-shopping-cart",
    data: {
      functionality: "shop",
    },
    items: [
      {
        id: "clients",
        label: $localize`:@@Shop_ShopNavClient:Clients`,
        routerLink: `/${AppPaths.SHOP}/clients`,
        icon: "pi pi-user",
      },
      {
        id: "products",
        label: $localize`:@@Shop_ProductsNav:Produits`,
        routerLink: `/${AppPaths.SHOP}/products`,
        icon: "pi pi-box",
      },
    ],
  },
  {
    id: AppPaths.ACCOUNTS,
    label: $localize`:@@Accounts_AccountsNav:Comptes`,
    routerLink: `/${AppPaths.ACCOUNTS}/users`,
    icon: "pi pi-users",
    items: [
      {
        id: "users",
        label: $localize`:@@Accounts_UsersNav:Utilisateurs`,
        routerLink: `/${AppPaths.ACCOUNTS}/users`,
        icon: "pi pi-user",
        data: {
          functionality: "users",
        },
      },
      {
        id: "password-policies",
        label: $localize`:@@Accounts_PasswordPoliciesNav:Politiques de mot de passe`,
        routerLink: `/${AppPaths.ACCOUNTS}/password-policies`,
        icon: "pi pi-lock",
        data: {
          functionality: "passwords",
        },
      },
    ],
  },
  {
    id: AppPaths.TOOLS,
    label: $localize`:@@Tools_ToolsNav:Outils`,
    routerLink: `/${AppPaths.TOOLS}/formbuilder`,
    icon: "pi pi-wrench",
    items: [
      {
        id: "formbuilder",
        label: $localize`:@@Tools_FormBuilderNav:Form Builder`,
        routerLink: `/${AppPaths.TOOLS}/formbuilder`,
        icon: "pi pi-hammer",
      },
      {
        id: "requests",
        label: $localize`:@@Tools_RequestsNav:Demandes`,
        routerLink: `/${AppPaths.TOOLS}/requests`,
        icon: "pi pi-inbox",
      },
    ],
  },
  {
    id: AppPaths.ADMIN,
    label: $localize`:@@Admin_AdminNav:Administration`,
    routerLink: `/${AppPaths.ADMIN}/roles`,
    icon: "pi pi-cog",
    data: {
      functionality: "roles",
    },
    items: [
      {
        id: "roles",
        label: $localize`:@@Admin_RolesNav:Rôles`,
        routerLink: `/${AppPaths.ADMIN}/roles`,
        icon: "pi pi-shield",
      },
      // {
      //   id: "cities",
      //   label: $localize`:@@Admin_CitiesNav:Villes`,
      //   routerLink: `/${AppPaths.ADMIN}/cities`,
      //   icon: "pi pi-building",
      // },
      {
        id: "documents",
        label: $localize`:@@Admin_DocumentsNav:Documents`,
        routerLink: `/${AppPaths.ADMIN}/documents`,
        icon: "pi pi-file",
      },
      {
        id: "routes",
        label: $localize`:@@Admin_RoutesNav:Routes`,
        routerLink: `/${AppPaths.ADMIN}/routes`,
        icon: "pi pi-directions",
      },
      {
        id: "consumers",
        label: $localize`:@@Admin_ConsumersNav:Consumers`,
        routerLink: `/${AppPaths.ADMIN}/consumers`,
        icon: "pi pi-users",
      },
    ],
  },
];
