/**
 * Mock backend for ngx-crud-builder-demo
 * Run: node mock-server/server.mjs
 *
 * Endpoints:
 *  POST /it-requests/search         — paginated search (TableLazyLoadEvent)
 *  POST /it-requests                — create
 *  PUT  /it-requests                — update
 *  POST /it-requests/archive        — archive { rows: [ids] }
 *  POST /it-requests/restore        — restore { rows: [ids] }
 *  GET  /it-requests/:id/history    — history
 *
 *  GET    /preferences/:cmpId       — list views
 *  POST   /preferences/:cmpId       — create view
 *  PUT    /preferences/:cmpId/:id   — update one view
 *  PUT    /preferences/:cmpId       — update many views { rows: [...] }
 *  DELETE /preferences/:cmpId/:id   — delete view
 */

import { createServer } from "node:http";

const PORT = 3000;

// ─── Seed data ────────────────────────────────────────────────────────────────

const archiveInfo = () => ({
  updatedAt: null,
  updaterId: null,
  updaterName: null,
  createdAt: null,
  creatorId: null,
  creatorName: null,
  archived: false,
  archivedAt: null,
});

/** @type {any[]} */
let itRequests = [
  { id: 1,  type: "laptop",    model: "Dell XPS 15",                  os: "windows", screenSize: 15.6, accessoryType: null,        desiredDate: "2026-03-20", estimatedBudget: 1800, justification: "Ancien laptop trop lent pour les tâches de développement", attachment: "", comments: "Préférence pour un modèle avec un processeur i7 ou supérieur", isValidated: false, ...archiveInfo() },
  { id: 2,  type: "screen",    model: "LG UltraWide 34WN80C",         os: null,      screenSize: 34,   accessoryType: null,        desiredDate: "2026-03-15", estimatedBudget: 650,  justification: "Besoin d'un deuxième écran pour améliorer la productivité",  attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 3,  type: "smartphone",model: "iPhone 15 Pro",                os: "ios",     screenSize: 6.1,  accessoryType: null,        desiredDate: "2026-04-01", estimatedBudget: 1200, justification: "Smartphone actuel obsolète, batterie défaillante",            attachment: "", comments: "Modèle 256GB minimum",                                           isValidated: true,  ...archiveInfo() },
  { id: 4,  type: "accessory", model: "Logitech MX Master 3S",        os: null,      screenSize: null, accessoryType: "mouse",     desiredDate: "2026-03-10", estimatedBudget: 100,  justification: "Souris ergonomique pour éviter les TMS",                      attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 5,  type: "laptop",    model: "MacBook Pro 16",               os: "macOS",   screenSize: 16,   accessoryType: null,        desiredDate: "2026-04-15", estimatedBudget: 2800, justification: "Développement iOS et design graphique nécessitant macOS",     attachment: "", comments: "M3 Max avec 32GB RAM",                                           isValidated: false, ...archiveInfo() },
  { id: 6,  type: "accessory", model: "Keychron K8 Pro",              os: null,      screenSize: null, accessoryType: "keyboard",  desiredDate: "2026-03-18", estimatedBudget: 120,  justification: "Clavier mécanique pour améliorer le confort de frappe",       attachment: "", comments: "Préférence pour les switchs Brown",                               isValidated: false, ...archiveInfo() },
  { id: 7,  type: "smartphone",model: "Samsung Galaxy S24 Ultra",     os: "android", screenSize: 6.8,  accessoryType: null,        desiredDate: "2026-03-25", estimatedBudget: 1300, justification: "Tests d'applications Android nécessitant un flagship récent", attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 8,  type: "screen",    model: "Dell UltraSharp U2723DE",      os: null,      screenSize: 27,   accessoryType: null,        desiredDate: "2026-04-05", estimatedBudget: 550,  justification: "Écran 4K pour le travail de design et retouche photo",         attachment: "", comments: "Calibrage colorimétrique requis",                                isValidated: false, ...archiveInfo() },
  { id: 9,  type: "accessory", model: "CalDigit TS4",                 os: null,      screenSize: null, accessoryType: "dock",      desiredDate: "2026-03-12", estimatedBudget: 380,  justification: "Station d'accueil Thunderbolt pour setup bureau",              attachment: "", comments: "Compatible Mac et PC",                                           isValidated: true,  ...archiveInfo() },
  { id: 10, type: "laptop",    model: "Lenovo ThinkPad X1 Carbon G11",os: "windows", screenSize: 14,   accessoryType: null,        desiredDate: "2026-03-30", estimatedBudget: 2100, justification: "Laptop léger et robuste pour les déplacements fréquents",     attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 11, type: "accessory", model: "Sony WH-1000XM5",              os: null,      screenSize: null, accessoryType: "headphones",desiredDate: "2026-03-08", estimatedBudget: 350,  justification: "Casque à réduction de bruit pour concentration en open space", attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 12, type: "laptop",    model: "ASUS ROG Zephyrus G14",        os: "windows", screenSize: 14,   accessoryType: null,        desiredDate: "2026-04-20", estimatedBudget: 1900, justification: "Développement de jeux et traitement 3D intensif",             attachment: "", comments: "RTX 4070 minimum",                                               isValidated: false, ...archiveInfo() },
  { id: 13, type: "smartphone",model: "Google Pixel 8 Pro",           os: "android", screenSize: 6.7,  accessoryType: null,        desiredDate: "2026-03-28", estimatedBudget: 950,  justification: "Tests Android pur et fonctionnalités IA",                     attachment: "", comments: "",                                                              isValidated: false, ...archiveInfo() },
  { id: 14, type: "screen",    model: "BenQ PD3220U",                 os: null,      screenSize: 32,   accessoryType: null,        desiredDate: "2026-04-10", estimatedBudget: 1100, justification: "Grand écran 4K pour CAO et modélisation 3D",                  attachment: "", comments: "Espace colorimétrique large requis",                             isValidated: true,  ...archiveInfo() },
  { id: 15, type: "accessory", model: "Incase Compact Sleeve",        os: null,      screenSize: null, accessoryType: "case",      desiredDate: "2026-03-05", estimatedBudget: 45,   justification: "Protection laptop pour déplacements quotidiens",               attachment: "", comments: "Pour MacBook 16 pouces",                                         isValidated: true,  ...archiveInfo(), archived: true, archivedAt: "2026-02-20" },
  { id: 16, type: "laptop",    model: "HP Spectre x360 14",           os: "windows", screenSize: 13.5, accessoryType: null,        desiredDate: "2026-04-25", estimatedBudget: 1600, justification: "Convertible pour présentations et prise de notes",            attachment: "", comments: "Avec stylet inclus",                                             isValidated: false, ...archiveInfo() },
  { id: 17, type: "accessory", model: "Razer BlackWidow V4 Pro",      os: null,      screenSize: null, accessoryType: "keyboard",  desiredDate: "2026-03-22", estimatedBudget: 200,  justification: "Clavier gaming pour développeur de jeux vidéo",               attachment: "", comments: "",                                                              isValidated: false, ...archiveInfo() },
  { id: 18, type: "smartphone",model: "OnePlus 12",                   os: "android", screenSize: 6.7,  accessoryType: null,        desiredDate: "2026-04-02", estimatedBudget: 850,  justification: "Backup phone pour tests multi-dispositifs",                   attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 19, type: "screen",    model: "Samsung Odyssey G9",           os: null,      screenSize: 49,   accessoryType: null,        desiredDate: "2026-05-01", estimatedBudget: 1500, justification: "Écran ultra-large pour trading et surveillance systèmes",      attachment: "", comments: "Configuration multi-fenêtres nécessaire",                        isValidated: false, ...archiveInfo() },
  { id: 20, type: "laptop",    model: "Framework Laptop 16",          os: "linux",   screenSize: 16,   accessoryType: null,        desiredDate: "2026-04-18", estimatedBudget: 2200, justification: "Laptop modulaire et réparable pour DevOps Linux",             attachment: "", comments: "Configuration AMD Ryzen",                                        isValidated: false, ...archiveInfo() },
  { id: 21, type: "accessory", model: "Anker 737 Power Bank",         os: null,      screenSize: null, accessoryType: "dock",      desiredDate: "2026-03-14", estimatedBudget: 150,  justification: "Batterie externe haute capacité pour déplacements",            attachment: "", comments: "24000mAh avec USB-C PD",                                        isValidated: true,  ...archiveInfo() },
  { id: 22, type: "screen",    model: "ASUS ProArt PA279CV",          os: null,      screenSize: 27,   accessoryType: null,        desiredDate: "2026-03-27", estimatedBudget: 480,  justification: "Écran précision couleurs pour édition vidéo",                 attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 23, type: "laptop",    model: "Microsoft Surface Laptop 5",   os: "windows", screenSize: 13.5, accessoryType: null,        desiredDate: "2026-05-05", estimatedBudget: 1500, justification: "Laptop élégant pour réunions clients",                        attachment: "", comments: "Couleur platine",                                                isValidated: false, ...archiveInfo() },
  { id: 24, type: "accessory", model: "Bose QuietComfort 45",         os: null,      screenSize: null, accessoryType: "headphones",desiredDate: "2026-03-16", estimatedBudget: 300,  justification: "Backup casque audio pour télétravail",                        attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 25, type: "smartphone",model: "iPhone 15",                    os: "ios",     screenSize: 6.1,  accessoryType: null,        desiredDate: "2026-04-08", estimatedBudget: 950,  justification: "Remplacement iPhone cassé",                                    attachment: "", comments: "128GB suffisant",                                                isValidated: true,  ...archiveInfo(), archived: true, archivedAt: "2026-03-01" },
  { id: 26, type: "accessory", model: "Logitech MX Keys",             os: null,      screenSize: null, accessoryType: "keyboard",  desiredDate: "2026-03-20", estimatedBudget: 110,  justification: "Clavier silencieux pour télétravail",                         attachment: "", comments: "Version rétroéclairée",                                          isValidated: false, ...archiveInfo() },
  { id: 27, type: "laptop",    model: "Acer Swift 3",                 os: "windows", screenSize: 14,   accessoryType: null,        desiredDate: "2026-04-12", estimatedBudget: 900,  justification: "Laptop budget pour stagiaire",                                 attachment: "", comments: "Ryzen 7 suffisant",                                              isValidated: true,  ...archiveInfo() },
  { id: 28, type: "screen",    model: "AOC 24G2",                     os: null,      screenSize: 24,   accessoryType: null,        desiredDate: "2026-03-31", estimatedBudget: 200,  justification: "Écran secondaire économique",                                  attachment: "", comments: "",                                                              isValidated: true,  ...archiveInfo() },
  { id: 29, type: "accessory", model: "Elgato Stream Deck",           os: null,      screenSize: null, accessoryType: "keyboard",  desiredDate: "2026-04-22", estimatedBudget: 150,  justification: "Contrôle macros pour streaming et automation",                 attachment: "", comments: "",                                                              isValidated: false, ...archiveInfo() },
  { id: 30, type: "smartphone",model: "Xiaomi 14",                    os: "android", screenSize: 6.36, accessoryType: null,        desiredDate: "2026-04-17", estimatedBudget: 750,  justification: "Tests compatibilité MIUI",                                     attachment: "", comments: "",                                                              isValidated: false, ...archiveInfo() },
];

/** @type {Record<number, any[]>} */
const requestsHistory = {
  1: [
    { id: 101, tstamp: "2026-03-01T09:12:00Z", operation: "INSERT", updaterId: 42, updaterName: "Alice Martin", record: { id: 1, type: "laptop", model: "Dell XPS 15", os: "windows", screenSize: 15.6, accessoryType: null, desiredDate: "2026-03-20", estimatedBudget: 1500, justification: "Ancien laptop trop lent", attachment: "", comments: "", isValidated: false, ...archiveInfo() } },
    { id: 102, tstamp: "2026-03-10T14:30:00Z", operation: "UPDATE", updaterId: 42, updaterName: "Alice Martin", record: { id: 1, type: "laptop", model: "Dell XPS 15", os: "windows", screenSize: 15.6, accessoryType: null, desiredDate: "2026-03-20", estimatedBudget: 1800, justification: "Ancien laptop trop lent pour les tâches de développement", attachment: "", comments: "Préférence pour un modèle avec un processeur i7 ou supérieur", isValidated: false, ...archiveInfo() } },
  ],
  2: [
    { id: 103, tstamp: "2026-02-28T11:00:00Z", operation: "INSERT", updaterId: 7, updaterName: "Bob Dupont", record: { id: 2, type: "screen", model: "LG UltraWide 34WN80C", os: null, screenSize: 34, accessoryType: null, desiredDate: "2026-03-15", estimatedBudget: 600, justification: "Besoin d'un deuxième écran", attachment: "", comments: "", isValidated: false, ...archiveInfo() } },
    { id: 104, tstamp: "2026-03-05T16:45:00Z", operation: "UPDATE", updaterId: 7,  updaterName: "Bob Dupont",   record: { id: 2, type: "screen", model: "LG UltraWide 34WN80C", os: null, screenSize: 34, accessoryType: null, desiredDate: "2026-03-15", estimatedBudget: 650, justification: "Besoin d'un deuxième écran pour améliorer la productivité", attachment: "", comments: "", isValidated: false, ...archiveInfo() } },
    { id: 105, tstamp: "2026-03-12T09:00:00Z", operation: "UPDATE", updaterId: 1,  updaterName: "Claire Admin", record: { id: 2, type: "screen", model: "LG UltraWide 34WN80C", os: null, screenSize: 34, accessoryType: null, desiredDate: "2026-03-15", estimatedBudget: 650, justification: "Besoin d'un deuxième écran pour améliorer la productivité", attachment: "", comments: "", isValidated: true,  ...archiveInfo() } },
  ],
};

// ─── Preferences store ────────────────────────────────────────────────────────
// keyed by componentId → array of TableConfig

/** @type {Record<string, any[]>} */
const preferences = {
  "it-requests": [
    {
      id: 1,
      component: "it-requests",
      name: "Défaut",
      conf: [
        { key: "id",              isVisible: false },
        { key: "type",            isVisible: true,  defaultWidth: "110px" },
        { key: "model",           isVisible: true,  defaultWidth: "160px" },
        { key: "os",              isVisible: true,  defaultWidth: "100px" },
        { key: "screenSize",      isVisible: true,  defaultWidth: "80px"  },
        { key: "accessoryType",   isVisible: false },
        { key: "desiredDate",     isVisible: true,  defaultWidth: "120px" },
        { key: "estimatedBudget", isVisible: true,  defaultWidth: "120px" },
        { key: "justification",   isVisible: false },
        { key: "attachment",      isVisible: false },
        { key: "comments",        isVisible: false },
        { key: "isValidated",     isVisible: true,  defaultWidth: "110px" },
        { key: "archived",        isVisible: true,  defaultWidth: "80px"  },
        { key: "archivedAt",      isVisible: false },
      ],
      isActive: true,
      locked: true,
    },
    {
      id: 2,
      component: "it-requests",
      name: "Compact",
      conf: [
        { key: "id",              isVisible: false },
        { key: "type",            isVisible: true,  defaultWidth: "100px" },
        { key: "model",           isVisible: true,  defaultWidth: "180px" },
        { key: "os",              isVisible: false },
        { key: "screenSize",      isVisible: false },
        { key: "accessoryType",   isVisible: false },
        { key: "desiredDate",     isVisible: true,  defaultWidth: "120px" },
        { key: "estimatedBudget", isVisible: true,  defaultWidth: "110px" },
        { key: "justification",   isVisible: false },
        { key: "attachment",      isVisible: false },
        { key: "comments",        isVisible: false },
        { key: "isValidated",     isVisible: true,  defaultWidth: "110px" },
        { key: "archived",        isVisible: false },
        { key: "archivedAt",      isVisible: false },
      ],
      isActive: false,
      locked: false,
    },
    {
      id: 3,
      component: "it-requests",
      name: "Justification",
      conf: [
        { key: "id",              isVisible: false },
        { key: "type",            isVisible: true,  defaultWidth: "100px" },
        { key: "model",           isVisible: true,  defaultWidth: "160px" },
        { key: "os",              isVisible: false },
        { key: "screenSize",      isVisible: false },
        { key: "accessoryType",   isVisible: false },
        { key: "desiredDate",     isVisible: true,  defaultWidth: "120px" },
        { key: "estimatedBudget", isVisible: true,  defaultWidth: "120px" },
        { key: "justification",   isVisible: true                         },
        { key: "attachment",      isVisible: true,  defaultWidth: "80px"  },
        { key: "comments",        isVisible: true                         },
        { key: "isValidated",     isVisible: true,  defaultWidth: "110px" },
        { key: "archived",        isVisible: false },
        { key: "archivedAt",      isVisible: false },
      ],
      isActive: false,
      locked: false,
    },
    {
      id: 4,
      component: "it-requests",
      name: "Archives",
      conf: [
        { key: "id",              isVisible: false },
        { key: "type",            isVisible: true,  defaultWidth: "100px" },
        { key: "model",           isVisible: true,  defaultWidth: "160px" },
        { key: "os",              isVisible: false },
        { key: "screenSize",      isVisible: false },
        { key: "accessoryType",   isVisible: false },
        { key: "desiredDate",     isVisible: false },
        { key: "estimatedBudget", isVisible: false },
        { key: "justification",   isVisible: false },
        { key: "attachment",      isVisible: false },
        { key: "comments",        isVisible: false },
        { key: "isValidated",     isVisible: false },
        { key: "archived",        isVisible: true,  defaultWidth: "80px"  },
        { key: "archivedAt",      isVisible: true,  defaultWidth: "130px" },
      ],
      isActive: false,
      locked: true,
    },
  ],
};

let nextPreferenceId = 100;
let nextRequestId = itRequests.length + 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read full request body as parsed JSON. */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

/** Send a JSON response. */
function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(body);
}

/** Apply basic filtering from a TableLazyLoadEvent. */
function applySearch(rows, event) {
  const { first = 0, rows: pageSize = 20, filters = {}, sortField, sortOrder = 1 } = event;

  let filtered = [...rows];

  // Filter
  for (const [key, meta] of Object.entries(filters)) {
    const filter = Array.isArray(meta) ? meta[0] : meta;
    if (filter?.value == null || filter.value === "") continue;

    const value = filter.value;
    const mode  = filter.matchMode ?? "contains";

    filtered = filtered.filter((row) => {
      const cell = row[key];
      if (cell == null) return false;
      switch (mode) {
        case "equals":          return String(cell) === String(value);
        case "notEquals":       return String(cell) !== String(value);
        case "contains":        return String(cell).toLowerCase().includes(String(value).toLowerCase());
        case "startsWith":      return String(cell).toLowerCase().startsWith(String(value).toLowerCase());
        case "endsWith":        return String(cell).toLowerCase().endsWith(String(value).toLowerCase());
        case "lt":              return Number(cell) < Number(value);
        case "lte":             return Number(cell) <= Number(value);
        case "gt":              return Number(cell) > Number(value);
        case "gte":             return Number(cell) >= Number(value);
        case "in":              return Array.isArray(value) && value.includes(cell);
        default:                return true;
      }
    });
  }

  // Sort
  if (sortField) {
    filtered.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortOrder * (av < bv ? -1 : av > bv ? 1 : 0);
    });
  }

  const total = filtered.length;
  const page  = filtered.slice(first, first + pageSize);
  return { rows: page, total };
}

// ─── Router ───────────────────────────────────────────────────────────────────

async function handle(req, res) {
  const url    = new URL(req.url, `http://localhost:${PORT}`);
  const path   = url.pathname;          // e.g. /it-requests/search
  const method = req.method.toUpperCase();
  const parts  = path.split("/").filter(Boolean); // ["it-requests", "search"]

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  console.log(`${method} ${path}`);

  // ── /it-requests ─────────────────────────────────────────────────────────

  // POST /it-requests/search
  if (method === "POST" && parts[0] === "it-requests" && parts[1] === "search") {
    const body = await readBody(req);
    return json(res, 200, applySearch(itRequests, body));
  }

  // POST /it-requests/archive
  if (method === "POST" && parts[0] === "it-requests" && parts[1] === "archive") {
    const { rows: ids } = await readBody(req);
    const now = new Date().toISOString();
    for (const id of ids) {
      const item = itRequests.find((r) => r.id === id);
      if (item) { item.archived = true; item.archivedAt = now; }
    }
    return json(res, 200, null);
  }

  // POST /it-requests/restore
  if (method === "POST" && parts[0] === "it-requests" && parts[1] === "restore") {
    const { rows: ids } = await readBody(req);
    for (const id of ids) {
      const item = itRequests.find((r) => r.id === id);
      if (item) { item.archived = false; item.archivedAt = null; }
    }
    return json(res, 200, null);
  }

  // GET /it-requests/:id/history
  if (method === "GET" && parts[0] === "it-requests" && parts[2] === "history") {
    const id = Number(parts[1]);
    const rows = requestsHistory[id] ?? [];
    return json(res, 200, { rows, total: rows.length });
  }

  // POST /it-requests  → create
  if (method === "POST" && parts[0] === "it-requests" && !parts[1]) {
    const { rows } = await readBody(req);
    const item = { ...rows[0], id: nextRequestId++ };
    itRequests.push(item);
    return json(res, 201, { rows: [item] });
  }

  // PUT /it-requests  → update
  if (method === "PUT" && parts[0] === "it-requests" && !parts[1]) {
    const { rows } = await readBody(req);
    const updated = rows[0];
    const idx = itRequests.findIndex((r) => r.id === updated.id);
    if (idx === -1) return json(res, 404, { message: "Not found" });
    itRequests[idx] = { ...itRequests[idx], ...updated };
    return json(res, 200, { rows: [itRequests[idx]] });
  }

  // ── /preferences ─────────────────────────────────────────────────────────

  // GET /preferences/:componentId
  if (method === "GET" && parts[0] === "preferences" && parts[1] && !parts[2]) {
    const cmpId = parts[1];
    const rows  = preferences[cmpId] ?? [];
    return json(res, 200, { rows, total: rows.length });
  }

  // POST /preferences/:componentId  → create view
  if (method === "POST" && parts[0] === "preferences" && parts[1] && !parts[2]) {
    const cmpId = parts[1];
    const body  = await readBody(req);
    const view  = { ...body, id: nextPreferenceId++ };
    preferences[cmpId] ??= [];
    preferences[cmpId].push(view);
    return json(res, 201, { rows: [view] });
  }

  // PUT /preferences/:componentId  → update many views
  if (method === "PUT" && parts[0] === "preferences" && parts[1] && !parts[2]) {
    const cmpId       = parts[1];
    const { rows }    = await readBody(req);
    preferences[cmpId] = rows;
    return json(res, 200, { rows });
  }

  // PUT /preferences/:componentId/:id  → update one view
  if (method === "PUT" && parts[0] === "preferences" && parts[1] && parts[2]) {
    const cmpId = parts[1];
    const id    = Number(parts[2]);
    const body  = await readBody(req);
    const list  = preferences[cmpId] ?? [];
    const idx   = list.findIndex((v) => v.id === id);
    if (idx === -1) {
      // view not found — insert it (first-time persistence)
      list.push({ ...body, id });
      preferences[cmpId] = list;
    } else {
      list[idx] = { ...list[idx], ...body, id };
    }
    return json(res, 200, { rows: [preferences[cmpId].find((v) => v.id === id)] });
  }

  // DELETE /preferences/:componentId/:id
  if (method === "DELETE" && parts[0] === "preferences" && parts[1] && parts[2]) {
    const cmpId = parts[1];
    const id    = Number(parts[2]);
    preferences[cmpId] = (preferences[cmpId] ?? []).filter((v) => v.id !== id);
    return json(res, 204, null);
  }

  // 404
  json(res, 404, { message: `No handler for ${method} ${path}` });
}

// ─── Start ────────────────────────────────────────────────────────────────────

const server = createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error("Handler error:", err.message);
    json(res, 500, { message: err.message });
  });
});

server.listen(PORT, () => {
  console.log(`\n  Mock backend running on http://localhost:${PORT}`);
  console.log("  Routes:");
  console.log("    POST /it-requests/search");
  console.log("    POST /it-requests          (create)");
  console.log("    PUT  /it-requests          (update)");
  console.log("    POST /it-requests/archive");
  console.log("    POST /it-requests/restore");
  console.log("    GET  /it-requests/:id/history");
  console.log("    GET  /preferences/:componentId");
  console.log("    POST /preferences/:componentId");
  console.log("    PUT  /preferences/:componentId");
  console.log("    PUT  /preferences/:componentId/:id");
  console.log("    DELETE /preferences/:componentId/:id\n");
});
