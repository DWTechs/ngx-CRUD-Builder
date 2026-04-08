import { InjectionToken, Provider } from "@angular/core";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (...args: unknown[]) => unknown
    ? T[P]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

export interface CrudLabels {
  toolbar: {
    export: string;
    configureColumns: string;
    refresh: string;
  };
  exportDialog: {
    header: string;
    chooseFormat: string;
    chooseData: string;
    all: string;
    selection: string;
    cancel: string;
    export: string;
  };
  columnsDialog: {
    header: string;
    cancel: string;
    save: string;
  };
  columnsViews: {
    title: string;
    add: string;
    delete: string;
    validate: string;
    cancel: string;
    deleteConfirmation: string;
  };
  tableActions: {
    edit: string;
    delete: string;
  };
  tableControl: {
    add: string;
    delete: string;
    noData: string;
    actionsColumnHeader: string;
    multiselectValidate: string;
    multiselectUnsavedChanges: string;
  };
  history: {
    restore: string;
    updatedAt: string;
    updatedBy: string;
    property: string;
    value: string;
    previousValue: string;
    noChanges: string;
  };
  editionDialog: {
    historyHeader: string;
    archive: string;
    modeCreate: string;
    modeConsult: string;
    modeEdit: string;
    cancel: string;
    close: string;
  };
  form: {
    reset: string;
    submit: string;
    noFields: string;
  };
  arrayElement: {
    delete: string;
  };
  picklist: {
    sourceHeader: string;
    targetHeader: string;
  };
  dateControl: {
    close: string;
    clear: string;
    today: string;
    validate: string;
  };
  richTextEditor: {
    editHtml: string;
  };
  fileUpload: {
    chooseFile: string;
    dragDropLabel: string;
    uploadedFilesTitle: string;
    canAddMore: string;
    cannotAddMore: string;
    maxFileSizeExceeded: (fileName: string, maxFileSize: number) => string;
  };
  autocomplete: {
    newOption: string;
  };
  validators: {
    invalid: string;
    required: string;
    unknownValue: string;
    emailInvalid: string;
    minlength: string;
    maxlength: string;
    max: string;
    min: string;
    maxFileSize: string;
  };
  patterns: {
    nameWithDashes: string;
    lettersWithSpaces: string;
    lettersWithoutSpaces: string;
    alphanumericalWithSpaces: string;
    alphanumerical: string;
    onlyCaps: string;
    integer: string;
    phoneNumber: string;
    withExtension: string;
  };
  archivedConfig: {
    label: string;
    labelAt: string;
    archived: string;
    active: string;
  };
  tableRegular: {
    currentPageReport: (first: string, last: string, total: string) => string;
  };
  table: {
    exportFailedTitle: string;
    exportFailedDetail: string;
    deleteConfirmationSingle: string;
    deleteConfirmationMultiple: (count: number) => string;
    restoreConfirmationSingle: string;
    restoreConfirmationMultiple: (count: number) => string;
    confirmationHeader: string;
    confirmationCancel: string;
    confirmationConfirm: string;
    defaultViewName: string;
  };
  download: {
    noPdfPrintWarning: string;
  };
}

export const DEFAULT_CRUD_LABELS: CrudLabels = {
  toolbar: {
    export: "Exporter les données",
    configureColumns: "Configurer les colonnes",
    refresh: "Rafraîchir les données",
  },
  exportDialog: {
    header: "Exporter les données",
    chooseFormat: "Choisir le format",
    chooseData: "Quelles données ?",
    all: "Tout",
    selection: "Sélection",
    cancel: "Annuler",
    export: "Exporter",
  },
  columnsDialog: {
    header: "Gestion des colonnes",
    cancel: "Annuler",
    save: "Valider",
  },
  columnsViews: {
    title: "Vues",
    add: "Ajouter",
    delete: "Supprimer",
    validate: "Valider",
    cancel: "Annuler",
    deleteConfirmation: "Êtes-vous sûr de vouloir supprimer cette vue ?",
  },
  tableActions: {
    edit: "Editer",
    delete: "Supprimer",
  },
  tableControl: {
    add: "Ajouter",
    delete: "Supprimer",
    noData: "Aucune donnée",
    actionsColumnHeader: "Actions",
    multiselectValidate: "Valider",
    multiselectUnsavedChanges: "Pensez à valider vos modifications",
  },
  history: {
    restore: "Restaurer",
    updatedAt: "Mis à jour le",
    updatedBy: "Mis à jour par",
    property: "Propriété",
    value: "Valeur",
    previousValue: "Ancienne valeur",
    noChanges: "Aucun changement",
  },
  editionDialog: {
    historyHeader: "Historique des modifications",
    archive: "Archiver",
    modeCreate: "Création",
    modeConsult: "Consultation",
    modeEdit: "Édition",
    cancel: "Annuler",
    close: "Fermer",
  },
  form: {
    reset: "Réinitialiser",
    submit: "Valider",
    noFields: "Aucun champ disponible",
  },
  arrayElement: {
    delete: "Supprimer",
  },
  picklist: {
    sourceHeader: "Disponibles",
    targetHeader: "Choix",
  },
  dateControl: {
    close: "Fermer",
    clear: "Effacer",
    today: "Aujourd'hui",
    validate: "Valider",
  },
  richTextEditor: {
    editHtml: "Editer HTML",
  },
  fileUpload: {
    chooseFile: "Choisir un fichier",
    dragDropLabel:
      "Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner",
    uploadedFilesTitle: "Fichiers téléchargés",
    canAddMore: "Vous pouvez ajouter plusieurs fichiers.",
    cannotAddMore:
      "Vous ne pouvez ajouter qu'un seul fichier. Veuillez supprimer le fichier actuel pour en ajouter un nouveau.",
    maxFileSizeExceeded: (fileName, maxFileSize) =>
      `Le fichier "${fileName}" dépasse la taille maximale autorisée de ${maxFileSize} octets.`,
  },
  autocomplete: {
    newOption: "(nouveau)",
  },
  validators: {
    invalid: "La valeur saisie est invalide",
    required: "Ce champ est obligatoire",
    unknownValue: "Merci de sélectionner une des valeurs suggérées",
    emailInvalid: "L'email est invalide",
    minlength:
      "La valeur saisie est trop courte ({requiredLength} caractères minimum)",
    maxlength:
      "La valeur saisie est trop longue ({requiredLength} caractères maximum)",
    max: "La valeur doit être inférieure ou égale à {max}",
    min: "La valeur doit être supérieure ou égale à {min}",
    maxFileSize: "La taille du fichier dépasse la taille maximale autorisée",
  },
  patterns: {
    nameWithDashes: "Caractères autorisés : lettres, espaces et tirets",
    lettersWithSpaces: "Caractères autorisés : lettres et espaces",
    lettersWithoutSpaces: "Caractères autorisés : lettres",
    alphanumericalWithSpaces:
      "Caractères autorisés : lettres, chiffres et espaces",
    alphanumerical: "Caractères autorisés : lettres et chiffres",
    onlyCaps: "Caractères autorisés : majuscules et chiffres",
    integer: "Un nombre entier est requis",
    phoneNumber: "Format de numéro de téléphone non valide",
    withExtension: "L'extension du fichier est obligatoire",
  },
  archivedConfig: {
    label: "Archivé",
    labelAt: "Archivé le",
    archived: "Archivé",
    active: "Actif",
  },
  tableRegular: {
    currentPageReport: (first, last, total) =>
      `De ${first} à ${last} sur ${total} élément(s)`,
  },
  table: {
    exportFailedTitle: "Echec de l'export",
    exportFailedDetail: "Une erreur est survenue lors de l'export des données.",
    deleteConfirmationSingle: "Etes-vous sûr de vouloir archiver cet élément ?",
    deleteConfirmationMultiple: (count) =>
      `Etes-vous sûr de vouloir archiver ces ${count} éléments ?`,
    restoreConfirmationSingle:
      "Etes-vous sûr de vouloir restaurer cet élément ?",
    restoreConfirmationMultiple: (count) =>
      `Etes-vous sûr de vouloir restaurer ces ${count} éléments ?`,
    confirmationHeader: "Confirmation",
    confirmationCancel: "Annuler",
    confirmationConfirm: "Confirmer",
    defaultViewName: "Default",
  },
  download: {
    noPdfPrintWarning:
      "Le fichier n'est pas un PDF, l'impression n'est pas disponible. Il sera téléchargé à la place.",
  },
};

export const CRUD_LABELS = new InjectionToken<CrudLabels>("CRUD_LABELS", {
  factory: () => DEFAULT_CRUD_LABELS,
});

/**
 * Provides a partial translation override merged with the French defaults.
 * Only supply the sections/keys you want to change.
 *
 * @example
 * providers: [
 *   provideCrudLabels({
 *     toolbar: { export: 'Export data', refresh: 'Refresh' },
 *     tableActions: { edit: 'Edit', delete: 'Delete' },
 *   })
 * ]
 */
export function provideCrudLabels(labels: DeepPartial<CrudLabels>): Provider {
  const merged = Object.fromEntries(
    (Object.keys(DEFAULT_CRUD_LABELS) as (keyof CrudLabels)[]).map((key) => [
      key,
      { ...(DEFAULT_CRUD_LABELS[key] as object), ...(labels[key] ?? {}) },
    ]),
  ) as unknown as CrudLabels;
  return { provide: CRUD_LABELS, useValue: merged };
}
