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
