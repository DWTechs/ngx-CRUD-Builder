import { AbstractControl } from "@angular/forms";
import { ActivatedRouteSnapshot } from "@angular/router";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { getDifferenceInDays } from "@crud/core/utils/dates/dates.utils";
import {
  max,
  min,
  minlength,
  required,
  requiredTrue,
} from "@form/utils/common.validators";
import { SelectItem } from "primeng/api";
import {
  ItRequest,
  RequestAccessoryType,
  RequestOs,
  RequestType,
} from "./request.model";

interface ConfPayload {
  types: SelectItem<RequestType>[];
  osOptions: (SelectItem<RequestOs> & { type: "laptop" | "smartphone" })[];
  accessoryTypes: SelectItem<RequestAccessoryType>[];
}

const dateValidator = (control: AbstractControl) => {
  if (control.value) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (getDifferenceInDays(today, selectedDate) < 5) {
      return {
        minDate: {
          days: 5,
          difference: getDifferenceInDays(today, selectedDate),
        },
      };
    }
  }
  return null;
};

/** UTILS METHODS */
const isModelVisible = (type: RequestType | null) =>
  type && ["laptop", "smartphone"].includes(type);

const isBudgetHigh = (budget: number | null) =>
  budget !== null && budget > 1500;

/**
 *
 * @param payload - Données nécessaires pour configurer les champs
 * @returns Configuration des champs pour la gestion des demandes de matériel
 */
export const REQUEST_CONF: (
  payload: ActivatedRouteSnapshot,
) => StrictCrudItemOptions<ItRequest>[] = (payload) => {
  const { types, osOptions, accessoryTypes } = payload.data as ConfPayload;
  return [
    {
      key: "type",
      label: "Type de matériel",
      controlType: "select",
      options: types,
      controlOptions: {
        validators: [required],
      },
    },
    {
      key: "model",
      label: "Marque / Modèle",
      controlType: "input",
      type: "text",
      controlOptions: {
        inputIcon: "pi pi-tag",
        validators: [required, minlength(3)],
      },
    },
    {
      key: "os",
      label: "Système d'exploitation",
      controlType: "select",
      options: osOptions,
      conditions: {
        options: ({ model }) =>
          osOptions?.filter((option) => model.type === option.type),
        controlOptions: {
          validators: ({ model }) =>
            isModelVisible(model.type) ? [required] : [],
          hidden: ({ model }) => !isModelVisible(model.type),
        },
      },
    },
    {
      key: "screenSize",
      label: "Taille d'écran (pouces)",
      controlType: "input",
      type: "number",
      controlOptions: {
        validators: [min(10), max(49)],
      },
      conditions: {
        controlOptions: {
          hidden: ({ model }) => model?.type !== "screen",
        },
      },
    },
    {
      key: "accessoryType",
      label: "Accessoires inclus",
      controlType: "multiselect",
      options: accessoryTypes,
      controlOptions: {},
      conditions: {
        controlOptions: {
          hidden: ({ model }) => model?.type !== "laptop",
        },
      },
    },
    {
      key: "desiredDate",
      label: "Date souhaitée",
      controlType: "date",
      controlOptions: {
        validators: [required, dateValidator],
      },
    },
    {
      key: "estimatedBudget",
      label: "Budget estimé (€)",
      controlType: "input",
      type: "number",
      controlOptions: {
        inputIcon: "pi pi-euro",
        validators: [required, min(1)],
      },
    },
    {
      key: "justification",
      label: "Justification",
      controlType: "textarea",
      controlOptions: {
        minWidth: "100%",
      },
      conditions: {
        controlOptions: {
          validators: ({ model }) =>
            isBudgetHigh(model?.estimatedBudget)
              ? [required, minlength(20)]
              : [],
          hidden: ({ model }) => !isBudgetHigh(model?.estimatedBudget),
        },
      },
    },
    {
      key: "attachment",
      label: "Pièce jointe (devis)",
      controlType: "files",
      controlOptions: {
        mediaType: ".pdf",
        minWidth: "100%",
      },
    },
    {
      key: "comments",
      label: "Commentaire libre",
      controlType: "textarea",
      controlOptions: {
        inputIcon: "pi pi-comment",
        minWidth: "100%",
      },
    },
    {
      key: "isValidated",
      label: "Validation manager",
      controlType: "checkbox",
      controlOptions: {
        validators: [requiredTrue],
        minWidth: "100%",
      },
    },
  ];
};
