# Contributing to @dwtechs/ngx-crud-builder

Thank you for your interest in contributing! This document explains how to set up the project locally and the conventions to follow when submitting changes.

---

## Table of contents

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Development workflow](#development-workflow)
- [Coding conventions](#coding-conventions)
- [Submitting a pull request](#submitting-a-pull-request)
- [Reporting a bug](#reporting-a-bug)
- [Requesting a feature](#requesting-a-feature)

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Angular CLI** ≥ 21 (`npm install -g @angular/cli`)

---

## Getting started

```bash
# 1. Fork and clone the repository
git clone https://github.com/DWTechs/ngx-crud-builder.git
cd ngx-crud-builder

# 2. Install dependencies
npm install

# 3. Start the demo application
npm run start:demo
# → http://localhost:4200

# 4. Run the test suite
npm test
```

---

## Project structure

```
ngx-crud-builder/
├── projects/
│   ├── ngx-crud-builder/          # The publishable library
│   │   └── src/
│   │       ├── public-api.ts  # Public exports — add new exports here
│   │       ├── core/          # Shared utilities, tokens, services
│   │       └── crud/
│   │           ├── core/      # Models, UI primitives, i18n, shared utils
│   │           ├── form/      # FormComponent and related pieces
│   │           └── table/     # TableComponent and related pieces
│   └── ngx-crud-builder-demo/     # Interactive demo application
├── CHANGELOG.md
└── LICENSE
```

---

## Development workflow

### Making changes to the library

The demo application consumes the library via TypeScript path mapping — no build step is needed during development:

```bash
npm run start:demo   # starts the demo with live reload
```

### Running tests

```bash
npm test             # run all tests once
```

Tests live next to the source files they cover (`*.spec.ts`). Add or update tests for every change you make to the library.

### Linting

The project uses [Biome](https://biomejs.dev/) for formatting and linting:

```bash
npx biome check .          # check
npx biome check --write .  # auto-fix
```

---

## Coding conventions

- **Angular 21+** patterns: standalone components, `input()` / `output()` / `model()` signals, `OnPush` change detection, `inject()` for dependency injection.
- **No `ngModules`** — every component and directive must be standalone.
- **No `any`** — prefer explicit types or `unknown`.
- Keep public API surface minimal: only export from `public-api.ts` what consumers genuinely need.
- Add or update entries in [CHANGELOG.md](CHANGELOG.md) under an `[Unreleased]` section for every user-facing change.

---

## Submitting a pull request

1. Create a branch from `master`: `git checkout -b feat/my-feature`
2. Make your changes and add tests.
3. Ensure `npm test` passes with no failures.
4. Ensure `npx biome check .` reports no errors.
5. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`.
6. Open a pull request against `master` with a clear description of what and why.

---

## Reporting a bug

Open a [GitHub issue](https://github.com/DWTechs/ngx-crud-builder/issues) with:
- A minimal reproducible example or steps to reproduce
- Expected vs actual behaviour
- Angular and library version numbers

---

## Requesting a feature

Open a [GitHub issue](https://github.com/DWTechs/ngx-crud-builder/issues) with a description of the use case and the desired behaviour. Linking to the relevant configuration option (e.g. a `ColumnOptions` or `ControlOptions` field) helps.

---

## Publish

Build the library first, then publish the built output from `dist/ngx-crud-builder/` — never from `projects/ngx-crud-builder/` (the source folder) or `dist/` directly.

```bash
npm run build:lib
cd dist/ngx-crud-builder
npm publish --dry-run  # simulate the publish
npm publish             # actual publish (publishConfig.access is already set to public)
```