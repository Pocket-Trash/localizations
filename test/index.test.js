import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  assertCompleteCatalogs,
  DEFAULT_LOCALE,
  enUS,
  esMX,
  formatMessage,
  formatTranslation,
  getMessages,
  getTranslations,
  localizations,
  messageKeys,
  messages,
  resolveLocale,
  translationKeys,
  translations,
} from "../dist/index.js";
import {
  createLocalization,
  syncLocalizations,
} from "../scripts/localizations.mjs";

test("resolves locale preferences with en-US fallback", () => {
  assert.equal(resolveLocale("fr-CA", "es-MX"), "es-MX");
  assert.equal(resolveLocale(["fr-CA", "en-US"]), "en-US");
  assert.equal(resolveLocale(null, undefined, "zz"), DEFAULT_LOCALE);
});

test("orders Accept-Language values by q weight", () => {
  assert.equal(resolveLocale("fr-CA, es-MX;q=0.9, en-US;q=0.8"), "es-MX");
  assert.equal(resolveLocale("fr-CA;q=0.9, en-US;q=0.8, es-MX;q=0.7"), "en-US");
});

test("does not treat bare en as a supported locale alias", () => {
  assert.equal(resolveLocale("en", "es-MX"), "es-MX");
  assert.equal(resolveLocale("en"), DEFAULT_LOCALE);
});

test("interpolates translation placeholders", () => {
  assert.equal(formatTranslation("app.name"), "Pocket Trash");
  assert.equal(formatTranslation("web.action.saveFlag"), "Save flag");
  assert.equal(
    formatTranslation("web.archive.itemCount", { visible: 2, total: 3 }),
    "2 of 3 items",
  );
  assert.equal(
    formatTranslation("web.collections.directory.itemCount", { count: 4 }),
    "Collection items: 4",
  );
  assert.equal(
    formatTranslation("locale.current", { locale: "es-MX" }, "es-MX"),
    "Idioma actual: es-MX",
  );
  assert.equal(
    formatTranslation("locale.current", {}, "en-US"),
    "Current language: {locale}",
  );
});

test("keeps message helpers as compatibility aliases", () => {
  assert.equal(getMessages, getTranslations);
  assert.equal(formatMessage, formatTranslation);
  assert.equal(messages, translations);
  assert.equal(messageKeys, translationKeys);
});

test("falls back to en-US translations for unsupported locales", () => {
  assert.equal(getTranslations(resolveLocale("fr-CA")), translations["en-US"]);
});

test("catalogs use nested sources and flat public translations", () => {
  assert.equal(assertCompleteCatalogs(), true);
  assert.equal(localizations["en-US"], enUS);
  assert.equal(localizations["es-MX"], esMX);
  assert.equal(localizations["es-MX"].action?.save, "Guardar");
  assert.equal(translations["es-MX"]["action.save"], "Guardar");
  assert.equal(translations["es-MX"]["web.action.saveFlag"], "Guardar bandera");
  assert.deepEqual(
    Object.keys(translations["es-MX"]).sort(),
    [...translationKeys].sort(),
  );
  assert.ok(translationKeys.includes("action.save"));
  assert.ok(translationKeys.includes("web.action.saveFlag"));
  assert.ok(translationKeys.includes("web.action.addColor"));
  assert.ok(translationKeys.includes("web.archive.itemCount"));
  assert.ok(translationKeys.includes("web.catalog.colorEffect.fade"));
  assert.ok(translationKeys.includes("web.catalog.field.productType"));
  assert.ok(translationKeys.includes("web.collections.finishChoice.custom"));
  assert.ok(translationKeys.includes("web.navigation.selectLanguage"));
  assert.ok(translationKeys.includes("web.page.resources.stub"));
});

test("resource catalogs have matching keys and format dynamic copy", () => {
  const flattenKeys = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof child === "string" ? [path] : flattenKeys(child, path);
    });

  assert.deepEqual(
    flattenKeys(enUS.web.resources).sort(),
    flattenKeys(esMX.web.resources).sort(),
  );
  assert.equal(
    formatTranslation(
      "web.resources.upload.progress",
      { filename: "spinner.stl", percent: 42 },
      "en-US",
    ),
    "Uploading spinner.stl: 42%",
  );
  assert.equal(
    formatTranslation(
      "web.resources.upload.progress",
      { filename: "spinner.stl", percent: 42 },
      "es-MX",
    ),
    "Subiendo spinner.stl: 42%",
  );
  assert.equal(
    formatTranslation(
      "web.resources.upload.fileFailure",
      { filename: "spinner.stl" },
      "en-US",
    ),
    "spinner.stl couldn't be uploaded. Retry this file.",
  );
  assert.equal(
    formatTranslation(
      "web.resources.upload.fileHelp",
      {
        maxFiles: 10,
        maxFileSize: "20 MiB",
        maxSessionSize: "50 MiB",
      },
      "es-MX",
    ),
    "Elige de 1 a 10 archivos. Cada archivo puede pesar hasta 20 MiB; la carga completa puede pesar hasta 50 MiB.",
  );
  assert.equal(
    formatTranslation("web.resources.detail.version", { version: 3 }, "es-MX"),
    "Versión 3",
  );
  assert.equal(
    formatTranslation(
      "web.resources.detail.filename",
      { filename: "spinner.stl" },
      "en-US",
    ),
    "File: spinner.stl",
  );
  assert.equal(
    formatTranslation("web.resources.detail.fileTypeFallback", {}, "en-US"),
    "File",
  );
  assert.equal(
    formatTranslation(
      "web.resources.detail.downloadCount",
      { count: 12 },
      "es-MX",
    ),
    "Descargas: 12",
  );
  assert.equal(
    formatTranslation(
      "web.resources.category.create",
      { category: "Bases" },
      "es-MX",
    ),
    "Crear “Bases”",
  );
});

test("scaffolds and syncs locale files from en-US", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "localizations-"));
  fs.mkdirSync(path.join(fixture, "src/localizations"), { recursive: true });
  fs.cpSync(
    "src/localizations/en-US.ts",
    path.join(fixture, "src/localizations/en-US.ts"),
  );
  fs.cpSync(
    "src/localizations/es-MX.ts",
    path.join(fixture, "src/localizations/es-MX.ts"),
  );
  fs.cpSync("src/index.ts", path.join(fixture, "src/index.ts"));

  createLocalization("nl-BE", { cwd: fixture });

  const nlBEPath = path.join(fixture, "src/localizations/nl-BE.ts");
  const scaffold = fs.readFileSync(nlBEPath, "utf8");
  const wiredIndex = fs.readFileSync(
    path.join(fixture, "src/index.ts"),
    "utf8",
  );

  assert.match(scaffold, /export const nlBE =/);
  assert.match(scaffold, /save: '',/);
  assert.match(wiredIndex, /'nl-BE'/);
  assert.match(
    wiredIndex,
    /import \{ nlBE \} from ["']\.\/localizations\/nl-BE\.js["'];/,
  );

  const enUSPath = path.join(fixture, "src/localizations/en-US.ts");
  fs.writeFileSync(
    enUSPath,
    fs.readFileSync(enUSPath, "utf8").replace(
      / {2}action: \{/,
      `  buttons: {
    action: {
      save: 'Save action',
    },
  },
  action: {`,
    ),
  );

  syncLocalizations({ cwd: fixture });

  assert.match(
    fs.readFileSync(nlBEPath, "utf8"),
    /buttons: \{\n {4}action: \{\n {6}save: '',/,
  );
});
