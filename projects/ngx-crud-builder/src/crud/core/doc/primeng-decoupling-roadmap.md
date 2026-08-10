# Rendre Optimus UI optionnel — état d'avancement

Objectif : pouvoir utiliser `ngx-crud-builder` sans dépendance obligatoire à Optimus UI (Material ou natif seul).

## ✅ Étape 1 — Toast & Confirm (fait, v0.1.10)
- `SnackbarService` et le nouveau `ConfirmService` sont des services signal-based, sans import Optimus UI.
- `crd-toast` / `crd-confirm` remplacent `<p-toast>` / `<p-confirmdialog>` dans `TableComponent`.
- `TableComponent` et `ColumnsViewsComponent` n'injectent plus `MessageService`/`ConfirmationService`.

## Étapes restantes

### 2. Toolbar de la table (`table-toolbar`)
- Boutons et menus actuellement basés sur des modules Optimus UI (`ButtonModule`, `MenuModule`, etc.).
- À remplacer par des équivalents `crd-*` (probablement extension de `crd-button` existant + un `crd-menu` à créer).

### 3. Dialogs de gestion des colonnes (`columns-management-dialog`, `columns-views`)
- Utilisent `DialogModule`, `ListboxModule`, `RadioButtonModule`, `InputTextModule`, `ButtonModule` de Optimus UI.
- `ConfirmService` est déjà découplé (étape 1) ; il reste le rendu du dialog et des contrôles de formulaire (listbox, radio, input) à remplacer par des éléments natifs ou des composants `crd-*`.

### 4. Export dialog
- Repose sur `DialogModule`/`RadioButtonModule` Optimus UI pour choisir le format d'export.
- À remplacer par `crd-modal` (déjà utilisé ailleurs) + contrôles natifs.

### 5. Cellules de filtre (`filter-cells`)
- Les filtres de colonnes (texte, date, select, etc.) utilisent des composants Optimus UI (`Calendar`, `Dropdown`, `MultiSelect`...).
- C'est la partie la plus large : chaque type de filtre a un équivalent Optimus UI à découpler, potentiellement avec un adaptateur similaire à celui déjà en place pour les form fields (`renderers-optimus-ui` / `renderers-material` / `renderers-native`).

### 6. `edition-dialog` — `CardModule` / `CheckboxModule`
- Encore deux imports Optimus UI résiduels dans le dialog d'édition (mise en page en carte + une checkbox).
- Remplaçables par du CSS natif (carte) et un `crd-checkbox` (à créer, sur le modèle de `crd-button`).

### 7. `history` component — `SharedModule` / `ButtonModule` / `TableModule`
- Le composant d'historique réutilise directement des modules Optimus UI pour son propre tableau et ses boutons.
- Nécessite soit un mini-tableau natif dédié, soit une réutilisation du futur shell de table découplé (voir étape 5/8).

### 8. Table shell (long terme)
- Le composant `tbl-table` lui-même reste construit sur `p-table` (`TableModule`, lazy loading, tri, pagination...).
- C'est la dépendance la plus structurante : nécessiterait un vrai "adapter" de table (comme pour les form fields) avec une implémentation native/Material et une implémentation Optimus UI, sélectionnable via `provideTableRenderer`.

### 9. Imports type-only
- Quelques imports de types uniquement (ex. `TableLazyLoadEvent` depuis `primeng/table` dans `table.component.ts`) suivent naturellement le découplage de l'étape 8 — pas d'action isolée nécessaire avant.

## Ordre de priorité suggéré
1. Toolbar (2) — surface relativement petite, bon suivi de l'étape 1.
2. Export dialog (4) — petite surface, réutilise `crd-modal` existant.
3. Edition dialog Card/Checkbox (6) — petite surface, complète le découplage de l'edition dialog.
4. Columns management dialogs (3).
5. History component (7).
6. Filter cells (5) — gros chantier, à traiter par type de filtre.
7. Table shell (8) — le plus gros chantier, probablement la dernière étape avant de pouvoir vraiment marquer Optimus UI comme "optionnel".
