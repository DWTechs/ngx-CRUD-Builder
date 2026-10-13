# Crud builder

This repository contains the Angular monorepo for the CRUD Builder library and its demo application.

- The published library lives in [projects/ngx-crud-builder](projects/ngx-crud-builder)
- The interactive demo app lives in [projects/ngx-crud-builder-demo](projects/ngx-crud-builder-demo)

**[View the live demo](https://crud-builder-12c1d.web.app)**

## What this repo includes

- Dynamic forms and configurable data tables
- CRUD workflows with validation, dialogs, export, history, and access control
- A demo app that showcases the library in realistic scenarios

For installation, configuration, and package-specific usage, see [projects/ngx-crud-builder/README.md](projects/ngx-crud-builder/README.md).

## Run the demo locally

```bash
git clone https://github.com/DWTechs/ngx-crud-builder.git
cd ngx-crud-builder
npm install
npm run start:demo
```

Then open http://localhost:4200.

### Demo routes

- `/` — interactive form demo
- `/table` — table configuration playground
- `/full-example` — end-to-end example with custom views and access control

## Repository layout

```text
projects/
├── ngx-crud-builder/        # published library
└── ngx-crud-builder-demo/   # demo application
```

## Releasing

Publishing to npm is done by the [Publish to npm](.github/workflows/publish-npm.yml) workflow, which uses npm trusted publishing (OIDC): no npm token is stored in the repository.

1. Bump `version` in both [package.json](package.json) and [projects/ngx-crud-builder/package.json](projects/ngx-crud-builder/package.json) (the latter is the published version and is checked against the tag).
2. Add the new version to [CHANGELOG.md](CHANGELOG.md).
3. Merge everything to `main`.
4. On GitHub, go to **Releases > Draft a new release**, create the tag `v<version>` (e.g. `v0.3.2`) targeting `main`, then click **Publish release**.

The workflow then fails fast if the tag is not on `main` or does not match `v<version>`, and otherwise runs lint, tests and the library build. It also verifies the package contents against [.github/scripts/check-package-files.mjs](.github/scripts/check-package-files.mjs), then publishes with provenance. Update that script when files are added to or removed from the published package.

To test the pipeline without publishing, run the **Publish to npm (dry run)** workflow from the Actions tab on any branch. To retry a failed publication without recreating the release, run **Publish to npm** manually from the `main` branch (it publishes the current `main` HEAD).
