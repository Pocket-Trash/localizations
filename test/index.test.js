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

test("global error recovery copy is complete in both supported locales", () => {
  const expected = {
    "en-US": {
      "web.page.error.title": "Something went wrong",
      "web.page.error.description": "We couldn't load this page. Try again.",
      "web.page.error.retry": "Retry",
      "web.page.error.retrying": "Retrying…",
      "web.page.error.returnHome": "Return home",
      "web.page.error.technicalDetails": "Technical details",
      "web.page.error.copyDetails": "Copy error details",
      "web.page.error.copied": "Copied",
      "web.page.error.copyFailed": "Copy failed",
      "web.page.notFound.returnHome": "Return home",
    },
    "es-MX": {
      "web.page.error.title": "Algo salió mal",
      "web.page.error.description":
        "No pudimos cargar esta página. Inténtalo de nuevo.",
      "web.page.error.retry": "Reintentar",
      "web.page.error.retrying": "Reintentando…",
      "web.page.error.returnHome": "Volver al inicio",
      "web.page.error.technicalDetails": "Detalles técnicos",
      "web.page.error.copyDetails": "Copiar detalles del error",
      "web.page.error.copied": "Copiado",
      "web.page.error.copyFailed": "No se pudo copiar",
      "web.page.notFound.returnHome": "Volver al inicio",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }

  assert.ok(translationKeys.includes("web.page.notFound.returnToArchive"));
  assert.ok(translationKeys.includes("web.resources.action.retry"));
});

test("admin hub and feedback notification copy is complete", () => {
  const expected = {
    "en-US": {
      "web.admin.hub.catalogImageTrash": "Catalog image trash",
      "web.admin.hub.description": "Manage Pocket Trash administration.",
      "web.admin.hub.title": "Admin Panel",
      "web.admin.notifications.title": "Notifications",
      "web.admin.trash.title": "Trash",
      "web.feedback.admin.navigation.allActive": "All active",
      "web.feedback.notification.completed": "Completed",
      "web.feedback.notification.description":
        "Review submitted and completed feedback activity.",
      "web.feedback.notification.empty": "No feedback notifications.",
      "web.feedback.notification.submitted": "Submitted",
      "web.feedback.notification.title": "Feedback notifications",
    },
    "es-MX": {
      "web.admin.hub.catalogImageTrash": "Papelera de imágenes del catálogo",
      "web.admin.hub.description": "Administra Pocket Trash.",
      "web.admin.hub.title": "Panel de administración",
      "web.admin.notifications.title": "Notificaciones",
      "web.admin.trash.title": "Papelera",
      "web.feedback.admin.navigation.allActive": "Todas activas",
      "web.feedback.notification.completed": "Completada",
      "web.feedback.notification.description":
        "Revisa la actividad de sugerencias enviadas y completadas.",
      "web.feedback.notification.empty":
        "No hay notificaciones de sugerencias.",
      "web.feedback.notification.submitted": "Enviada",
      "web.feedback.notification.title": "Notificaciones de sugerencias",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }
});

test("catalog filter copy and blank Spanish entries use the right translations", () => {
  for (const key of [
    "web.action.more",
    "web.action.moreFilters",
    "web.catalog.error.colorHex",
    "web.catalog.field.colorValue",
    "web.catalog.filter.description",
    "web.catalog.filter.fadeName",
    "web.catalog.filter.moreOptions",
    "web.catalog.filter.productTypeAll",
    "web.collections.directory.matchingItemCount",
  ]) {
    assert.ok(translationKeys.includes(key));
  }

  assert.equal(esMX.web.action.addToCollection, "");
  assert.equal(
    translations["es-MX"]["web.action.addToCollection"],
    "Add to collection",
  );
  assert.equal(translations["es-MX"]["web.action.addColor"], "Agregar color");
  assert.equal(
    formatTranslation(
      "web.catalog.filter.moreOptions",
      { label: "colores" },
      "es-MX",
    ),
    "Más opciones de colores",
  );
  assert.equal(
    formatTranslation(
      "web.collections.directory.matchingItemCount",
      { matching: 2, total: 5 },
      "es-MX",
    ),
    "2 de 5 artículos de la colección",
  );
});

test("catalog source-detail copy falls back from blank Spanish entries", () => {
  const entries = {
    "web.catalog.field.makerProductUrl": "Maker product URL",
    "web.catalog.field.spinDiameter": "Spin diameter",
    "web.catalog.field.bearing": "Bearing",
    "web.catalog.help.markdownDescription":
      "Markdown supported. 5,000 characters maximum.",
    "web.catalog.help.makerProductUrl":
      "Direct link to the product on the maker's website.",
    "web.catalog.help.collectionDescriptionOverride":
      "Leave blank to use the product description. Markdown supported. 5,000 characters maximum.",
    "web.catalog.error.descriptionLength": "Enter 5,000 characters or fewer.",
    "web.catalog.error.bearingLength": "Enter 200 characters or fewer.",
  };

  for (const [key, english] of Object.entries(entries)) {
    const esMXValue = key
      .split(".")
      .reduce((resource, segment) => resource[segment], esMX);

    assert.equal(esMXValue, "");
    assert.equal(translations["en-US"][key], english);
    assert.equal(translations["es-MX"][key], english);
  }
});

test("multiple collection copy falls back from blank Spanish entries", () => {
  const keys = [
    "web.action.addCollection",
    "web.action.clearCover",
    "web.action.deleteCover",
    "web.action.selectCover",
    "web.collections.add.title",
    "web.collections.cover.clearConfirmation",
    "web.collections.cover.current",
    "web.collections.cover.deleteConfirmation",
    "web.collections.cover.history",
    "web.collections.edit.title",
    "web.collections.emptyCollections",
    "web.collections.error.chooseCollection",
    "web.collections.error.syncIncomplete",
    "web.collections.error.upload",
    "web.collections.field.collection",
    "web.collections.field.cover",
    "web.collections.field.description",
    "web.collections.field.name",
    "web.collections.placeholder.description",
    "web.collections.placeholder.name",
    "web.collections.select.addNew",
    "web.collections.select.placeholder",
    "web.collections.visibility.privateCallout",
  ];

  for (const key of keys) {
    const esMXValue = key
      .split(".")
      .reduce((resource, segment) => resource[segment], esMX);

    assert.equal(esMXValue, "");
    assert.equal(translations["es-MX"][key], translations["en-US"][key]);
  }
});

test("catalog and help copy is complete in both supported locales", () => {
  const keys = [
    "web.action.view",
    "web.action.viewCollection",
    "web.action.viewItem",
    "web.action.viewProductDetails",
    "web.catalog.collectionsWithProduct",
    "web.catalog.images.aspectRatioGuideLink",
    "web.catalog.images.aspectRatioWarning",
    "web.collections.field.displayName",
    "web.help.comingSoon",
    "web.help.contact",
    "web.help.dateModified",
    "web.help.datePublished",
    "web.help.developmentCallout",
    "web.help.topics",
    "web.navigation.help",
  ];

  for (const key of keys) {
    assert.ok(translationKeys.includes(key));
    assert.ok(translations["en-US"][key]);
    assert.ok(translations["es-MX"][key]);
    assert.notEqual(translations["es-MX"][key], translations["en-US"][key]);
    assert.notEqual(
      translations["en-US"][key],
      translations["en-US"]["error.generic"],
    );
    assert.notEqual(
      translations["es-MX"][key],
      translations["es-MX"]["error.generic"],
    );
  }
});

test("footer and public navigation copy is complete in both supported locales", () => {
  const expected = {
    "en-US": {
      "web.footer.discordNewTab": "Discord (opens in a new tab)",
      "web.footer.tagline": "Made by EDC fans for EDC fans",
      "web.footer.xNewTab": "X (opens in a new tab)",
      "web.navigation.contact": "Contact",
      "web.navigation.home": "Home",
      "web.navigation.privacy": "Privacy",
      "web.navigation.termsOfService": "Terms of service",
    },
    "es-MX": {
      "web.footer.discordNewTab": "Discord (se abre en una pestaña nueva)",
      "web.footer.tagline": "Hecho por fans de EDC para fans de EDC",
      "web.footer.xNewTab": "X (se abre en una pestaña nueva)",
      "web.navigation.contact": "Contacto",
      "web.navigation.home": "Inicio",
      "web.navigation.privacy": "Privacidad",
      "web.navigation.termsOfService": "Términos del servicio",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }
});

test("feedback discovery copy is complete in both supported locales", () => {
  const keys = [
    "web.feedback.board.empty",
    "web.feedback.board.error",
    "web.feedback.board.loading",
    "web.feedback.board.searchLabel",
    "web.feedback.board.searchPlaceholder",
    "web.feedback.details.open",
    "web.feedback.details.title",
    "web.feedback.duplicates.description",
    "web.feedback.duplicates.submitAnyway",
    "web.feedback.duplicates.title",
    "web.feedback.duplicates.upvote",
    "web.feedback.myRequests.error",
    "web.feedback.myRequests.loading",
    "web.feedback.myRequests.nextPage",
    "web.feedback.myRequests.noResults",
    "web.feedback.myRequests.previousPage",
    "web.feedback.myRequests.searchLabel",
    "web.feedback.myRequests.searchPlaceholder",
    "web.feedback.status.completed",
    "web.feedback.status.inProgress",
    "web.feedback.status.planned",
    "web.feedback.vote.add",
    "web.feedback.vote.failure",
    "web.feedback.vote.permanent",
    "web.feedback.vote.remove",
  ];

  for (const key of keys) {
    assert.ok(translationKeys.includes(key));
    assert.ok(translations["en-US"][key]);
    assert.ok(translations["es-MX"][key]);
    assert.notEqual(translations["es-MX"][key], translations["en-US"][key]);
  }

  assert.equal(
    formatTranslation(
      "web.feedback.details.open",
      { title: "Saved searches" },
      "en-US",
    ),
    "View details for Saved searches",
  );
});

test("feedback administration copy is complete in both supported locales", () => {
  const flatten = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof child === "string" ? [[path, child]] : flatten(child, path);
    });
  const english = flatten(enUS.web.feedback.admin);
  const spanish = new Map(flatten(esMX.web.feedback.admin));

  assert.deepEqual(
    english.map(([key]) => key).sort(),
    [...spanish.keys()].sort(),
  );
  for (const [key, value] of english) {
    assert.ok(value);
    assert.ok(spanish.get(key));
  }
  for (const status of ["canceled", "denied", "merged"]) {
    assert.ok(enUS.web.feedback.status[status]);
    assert.ok(esMX.web.feedback.status[status]);
  }
  for (const value of [
    esMX.action.cancel,
    esMX.action.save,
    esMX.web.action.clearSearch,
    esMX.web.action.edit,
    esMX.web.catalog.field.description,
    esMX.web.feedback.new.categoryLabel,
    esMX.web.feedback.new.titleLabel,
    esMX.web.navigation.admin,
  ]) {
    assert.ok(value);
  }
  assert.equal(
    translations["es-MX"]["web.catalog.field.description"],
    "Descripción",
  );
  assert.equal(enUS.web.feedback.admin.active.title, "Planned");
  assert.equal(esMX.web.feedback.admin.active.title, "Planificadas");
  assert.equal(
    formatTranslation(
      "web.feedback.admin.sort.ascending",
      { column: "Title" },
      "en-US",
    ),
    "Sort Title ascending",
  );
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

test("shared upload copy formats sizes and keeps failures target-neutral", () => {
  for (const locale of ["en-US", "es-MX"]) {
    assert.equal(
      formatTranslation("web.storage.sizeMiB", { value: 25 }, locale),
      "25 MiB",
    );
  }

  assert.equal(
    translations["en-US"]["web.upload.saveFailed"],
    "We couldn't save your upload. Try again.",
  );
  assert.equal(
    translations["es-MX"]["web.upload.saveFailed"],
    "No pudimos guardar tu carga. Inténtalo de nuevo.",
  );
  assert.equal(
    translations["en-US"]["web.upload.finalizationFailure"],
    "Your files were uploaded, but the upload could not be finalized. Try again.",
  );
  assert.equal(
    translations["es-MX"]["web.upload.finalizationFailure"],
    "Tus archivos se cargaron, pero no se pudo finalizar la carga. Inténtalo de nuevo.",
  );
  assert.equal(
    translations["en-US"]["web.resources.upload.fileTypes"],
    "Allowed file types: STL, 3MF, STEP, STP, PDF, TXT, ZIP, JPEG, PNG, and WebP.",
  );
  assert.equal(
    translations["es-MX"]["web.resources.upload.fileTypes"],
    "Tipos de archivo permitidos: STL, 3MF, STEP, STP, PDF, TXT, ZIP, JPEG, PNG y WebP.",
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
