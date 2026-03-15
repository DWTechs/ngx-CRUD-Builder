import { GroupValidatorFn } from "@form/utils/group-validator.model";

export const budgetValidator: GroupValidatorFn = (control) => {
  const formGroup = control;
  const type = formGroup.get("type")?.value;
  const estimatedBudget = formGroup.get("estimatedBudget")?.value;
  if (!type || !estimatedBudget) {
    return null;
  }

  const maxBudgetByType: Record<string, number> = {
    screen: 800,
    laptop: 3000,
    smartphone: 1500,
    accessory: Number.POSITIVE_INFINITY, // Pas de limite pour les accessoires
  };

  const maxBudget = maxBudgetByType[type];

  if (maxBudget && estimatedBudget > maxBudget) {
    return {
      budgetExceeded: {
        type,
        maxBudget,
        currentBudget: estimatedBudget,
        message: "Le budget maximum pour {type} est de {maxBudget}€",
      },
    };
  }

  return null;
};
