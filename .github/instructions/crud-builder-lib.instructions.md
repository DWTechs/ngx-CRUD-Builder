---
description: "Use when modifying, adding, or removing features, inputs, outputs, models, or services in the crud-builder library (projects/crud-builder/). Covers demo sync and documentation update rules."
applyTo: "projects/crud-builder/**"
---

# Checklist après toute modification de la lib

Après chaque changement dans `projects/crud-builder/`, vérifie systématiquement les deux points suivants.

## 1. Démos à mettre à jour

Inspecte les pages de démo pour voir si le changement peut y être illustré :

| Page | Chemin |
|------|--------|
| Table demo | `projects/crud-builder-demo/src/app/table-demo/` |
| Form demo | `projects/crud-builder-demo/src/app/form-demo/` |
| Full example | `projects/crud-builder-demo/src/app/full-example/` |

**Règle :** si le changement introduit une nouvelle option, un nouveau comportement, ou retire quelque chose, propose (ou applique) la modification de la démo la plus pertinente pour refléter le changement.

## 2. Documentation à mettre à jour

Vérifie si un des fichiers de doc est concerné :

| Fichier | Couvre |
|---------|--------|
| `projects/crud-builder/src/crud/core/doc/table.component.md` | Inputs/outputs du `TableComponent` |
| `projects/crud-builder/src/crud/core/doc/form.component.md` | Inputs/outputs du `FormComponent` |
| `projects/crud-builder/src/crud/core/doc/column-options.md` | Options de colonne (`CrudItemOptions`) |
| `projects/crud-builder/src/crud/core/doc/control-options.documentation.md` | Options de contrôle de formulaire |

**Règle :** si un input, output, modèle ou comportement change, mets à jour le fichier `.md` correspondant dans `doc/`. La doc est rendue dans l'app demo via `projects/crud-builder-demo/src/app/doc/`.
