# Plan d'audit — ngx-crud-builder

Suivi des chantiers issus de l'audit du 2026-08-15. Chaque chantier est traité un par un, dans l'ordre de priorité. Cocher une fois terminé.

## Priorité haute

- [x] **1. Tests unitaires pour `table.component.ts`**
  - Fichier : `projects/ngx-crud-builder/src/crud/table/table.component.ts`
  - Constat : 885 lignes, ~110 membres, aucun spec dédié.
  - Objectif : créer une suite de specs (sur le modèle de `crud/form/form/specs/`) couvrant pagination, filtres, sélection, export, gestion des colonnes.
  - Fait : suite créée dans `crud/table/specs/` (helpers + 4 fichiers, 25 tests) couvrant création, édition, archivage/restauration, synchronisation URL et chargement paresseux initial.

- [ ] **2. Tests unitaires pour `crud.repository.ts`**
  - Fichier : `projects/ngx-crud-builder/src/crud/core/utils/crud-service/crud.repository.ts`
  - Constat : logique CRUD centrale (get/create/update/archive/restore/cache) sans couverture.
  - Objectif : mock `HttpClient`, tester chaque opération + le cache (`getAndCacheAll` / `invalidateCache`) + gestion d'erreurs (`catchError`).

- [ ] **3. Remplacer la sanitisation HTML manuelle**
  - Fichiers : `crud/core/ui/table-cell/cell-renderers/wysiwyg-renderer.ts`, `crud/core/utils/table/cell-text-content.class.ts`
  - Constat : suppression des `<script>` sur un `<div>` détaché, comportement implicite fragile.
  - Objectif : utiliser `DomSanitizer.sanitize(SecurityContext.HTML, value)` (ou équivalent) au lieu de la manipulation DOM manuelle.

## Priorité moyenne

- [ ] **4. Découper `table.component.ts`**
  - Objectif : extraire des services dédiés (ex: sélection, export, colonnes) pour réduire la responsabilité du composant et faciliter les tests du chantier 1.
  - Dépend du chantier 1 (avoir des tests avant de refactorer).

- [ ] **5. Lint strict + CI**
  - Fichiers : `biome.json`, `.github/workflows/ci.yml`
  - Objectif : activer des règles supplémentaires (`noConsole`, `noExplicitAny`, complexité) et ajouter un job `biome check` dans la CI.

- [ ] **6. Nettoyer les `console.log` et les usages de `any`**
  - Fichiers concernés : `crud/form/form/form.component.ts`, `core/utils/debug/debug.ts`, `crud/core/utils/download/download.service.ts`, `crud/core/utils/offline/offline.service.ts`, + 19 usages de `any`/`as any`/`<any>` à travers le repo.
  - Objectif : passer par un service de logging conditionné en prod ; remplacer les `any` par des types stricts ou `unknown` + garde de type.

## Priorité basse

- [ ] **7. Scinder les peer dependencies optionnelles**
  - Constat : `exceljs`, `quill`, etc. sont des `peerDependencies` obligatoires alors qu'ils ne sont utilisés que par certaines features (export Excel, rich-text).
  - Objectif : créer des secondary entry points (sur le modèle de `material/`) pour rendre ces dépendances réellement optionnelles.
  - Note : vérifier aussi la dépendance `@openng/optimus-ui@^2.0.0-rc.0` (pre-release en peer dependency).

- [ ] **8. Nettoyage divers**
  - Dédoublonnage de `@angular/cdk` dans `package.json` (présent en `dependencies` et `devDependencies` avec des ranges différents).
  - Trier les 7 marqueurs `TODO`/`FIXME` restants (dont celui de `crud.repository.ts`) : résoudre ou transformer en issues GitHub.

---

**Méthode de travail** : on traite les chantiers dans l'ordre ci-dessus, un par un. Après chaque chantier : lancer les tests (`npm run test`) et le build (`npm run build:lib`), puis cocher la case correspondante avant de passer au suivant.
