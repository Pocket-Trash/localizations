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

test("collection deletion warnings are translated and interpolate names", () => {
  for (const locale of ["en-US", "es-MX"]) {
    for (const key of [
      "deleteConfirmation",
      "deleteChoice",
      "destination",
      "itemAction",
      "itemConfirmation",
      "itemDescription",
      "moveAction",
      "moveChoice",
      "moveConfirmation",
      "moveSummary",
      "noDestination",
      "open",
    ]) {
      assert.ok(translations[locale][`web.collections.deletion.${key}`]);
    }
    assert.ok(
      formatTranslation(
        "web.collections.deletion.itemDescription",
        { name: "Katla" },
        locale,
      ).includes("Katla"),
    );
    const move = formatTranslation(
      "web.collections.deletion.moveSummary",
      { count: 2, destination: "Archive" },
      locale,
    );
    assert.ok(move.includes("2") && move.includes("Archive"));
    assert.notEqual(
      translations[locale]["web.collections.deletion.deleteConfirmation"],
      translations[locale]["web.collections.deletion.moveConfirmation"],
    );
  }
});

test("falls back to en-US translations for unsupported locales", () => {
  assert.equal(getTranslations(resolveLocale("fr-CA")), translations["en-US"]);
});

test("product deletion copy is translated and interpolates the product name", () => {
  for (const locale of ["en-US", "es-MX"]) {
    for (const key of [
      "action",
      "blocked",
      "confirmation",
      "description",
      "failed",
      "title",
    ]) {
      assert.ok(translations[locale][`web.catalog.deletion.${key}`]);
      assert.ok(translationKeys.includes(`web.catalog.deletion.${key}`));
    }
    assert.ok(
      formatTranslation(
        "web.catalog.deletion.description",
        { name: "Katla" },
        locale,
      ).includes("Katla"),
    );
    assert.notEqual(
      translations[locale]["web.catalog.deletion.failed"],
      translations[locale]["error.generic"],
    );
  }
  assert.notEqual(
    translations["en-US"]["web.catalog.deletion.confirmation"],
    translations["es-MX"]["web.catalog.deletion.confirmation"],
  );
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

test("product directory and configuration copy is complete", () => {
  const expected = {
    "en-US": {
      "web.admin.config.products.description":
        "Search product types and choose which ones are parts or accessories.",
      "web.admin.config.products.noResults":
        "No product types match your search.",
      "web.admin.config.products.partOrAccessoryLabel":
        "Mark {name} as a part or accessory",
      "web.admin.config.products.searchPlaceholder": "Search product types",
      "web.admin.config.products.updated": "Updated {name}.",
      "web.admin.config.products.updateFailed": "Could not update {name}.",
      "web.admin.config.title": "Config and Settings",
      "web.catalog.allProducts": "All Products",
      "web.catalog.partsAndAccessories": "Parts and Accessories",
    },
    "es-MX": {
      "web.admin.config.products.description":
        "Busca tipos de producto y elige cuáles son piezas o accesorios.",
      "web.admin.config.products.noResults":
        "Ningún tipo de producto coincide con tu búsqueda.",
      "web.admin.config.products.partOrAccessoryLabel":
        "Marcar {name} como pieza o accesorio",
      "web.admin.config.products.searchPlaceholder": "Buscar tipos de producto",
      "web.admin.config.products.updated": "Se actualizó {name}.",
      "web.admin.config.products.updateFailed": "No se pudo actualizar {name}.",
      "web.admin.config.title": "Configuración y ajustes",
      "web.catalog.allProducts": "Todos los productos",
      "web.catalog.partsAndAccessories": "Piezas y accesorios",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }
});

test("materials copy is complete in both supported locales", () => {
  const keys = [
    "web.admin.hub.materials",
    "web.materials.admin.addTitle",
    "web.materials.admin.created",
    "web.materials.admin.description",
    "web.materials.admin.editTitle",
    "web.materials.admin.empty",
    "web.materials.admin.saved",
    "web.materials.admin.slugHelp",
    "web.materials.admin.title",
    "web.materials.count.collectionItems",
    "web.materials.count.products",
    "web.materials.detail.collectionItems",
    "web.materials.detail.collectionItemsPagination",
    "web.materials.detail.noCollectionItems",
    "web.materials.detail.noProducts",
    "web.materials.detail.products",
    "web.materials.detail.productsPagination",
    "web.materials.directory.description",
    "web.materials.directory.empty",
    "web.materials.directory.other",
    "web.materials.directory.popular",
    "web.materials.directory.tableOfContents",
    "web.materials.directory.title",
    "web.materials.image.alt",
    "web.materials.image.archiveConfirmation",
    "web.materials.image.empty",
    "web.materials.image.placeholder",
    "web.materials.image.restore",
    "web.materials.image.restoreConfirmation",
    "web.materials.image.uploadFailed",
    "web.materials.image.uploadHelp",
    "web.materials.validation.duplicateImage",
    "web.navigation.materials",
  ];

  for (const locale of ["en-US", "es-MX"]) {
    for (const key of keys) {
      assert.ok(translationKeys.includes(key), `${key} is typed`);
      assert.ok(localizations[locale].web.materials, `${locale} has materials`);
      assert.ok(translations[locale][key], `${locale} has ${key}`);
    }
  }

  assert.equal(
    formatTranslation(
      "web.materials.count.collectionItems",
      { count: 3 },
      "es-MX",
    ),
    "Artículos de colección: 3",
  );
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

test("slider vocabulary is complete in English and Spanish", () => {
  const expected = {
    "en-US": {
      "web.slider.productType.slider": "Slider",
      "web.slider.productType.plate": "Slider plate",
      "web.slider.productType.insert": "Slider insert",
      "web.slider.capability.bodyHosted": "Body-hosted",
      "web.slider.capability.insertDriven": "Insert-driven",
      "web.slider.capability.sliderBodyHoldsMagnets":
        "Slider body holds magnets",
      "web.slider.capability.usesInserts": "This slider uses inserts",
      "web.slider.appearance.optional": "Appearance is optional",
      "web.slider.layout.label": "Magnet layout",
      "web.slider.layout.option": "{layout} — {count}-click",
      "web.slider.layout.help":
        "{layout} has {rows} rows, {columns} lengthwise positions, {slots} slots per side, and {clicks} clicks.",
      "web.slider.setup.default": "Default setup",
      "web.slider.setup.notRecorded": "Not recorded",
      "web.slider.magnet.halfA": "Half A",
      "web.slider.magnet.halfB": "Half B",
      "web.slider.magnet.state.occupied": "Occupied",
      "web.slider.magnet.state.empty": "Empty",
      "web.slider.magnet.state.unknown": "Unknown",
      "web.slider.relationship.includedComponents": "Included components",
      "web.slider.relationship.includedInsert": "Included insert",
      "web.slider.component.plateSet": "Plate set",
      "web.slider.component.insertSet": "Insert set",
      "web.slider.component.spare": "Spare",
      "web.slider.search.matchedAliasContext": "Matched alias: {alias}",
      "web.slider.filter.spinnerButton": "Spinner button",
      "web.slider.privacy.inherited": "Inherited privacy",
      "web.slider.moderation.blockedTitle": "Action blocked",
      "web.slider.empty.noOffers": "No setup offers are available.",
    },
    "es-MX": {
      "web.slider.productType.slider": "Deslizador",
      "web.slider.productType.plate": "Placa para deslizador",
      "web.slider.productType.insert": "Inserto para deslizador",
      "web.slider.capability.bodyHosted": "Integrado en el cuerpo",
      "web.slider.capability.insertDriven": "Basado en inserto",
      "web.slider.capability.sliderBodyHoldsMagnets":
        "El cuerpo del deslizador sostiene los imanes",
      "web.slider.capability.usesInserts": "Este deslizador usa insertos",
      "web.slider.appearance.optional": "La apariencia es opcional",
      "web.slider.layout.label": "Distribución de imanes",
      "web.slider.layout.option": "{layout} — {count} clics",
      "web.slider.layout.help":
        "{layout} tiene {rows} filas, {columns} posiciones longitudinales, {slots} espacios por lado y {clicks} clics.",
      "web.slider.setup.default": "Configuración predeterminada",
      "web.slider.setup.notRecorded": "No registrado",
      "web.slider.magnet.halfA": "Mitad A",
      "web.slider.magnet.halfB": "Mitad B",
      "web.slider.magnet.state.occupied": "Ocupada",
      "web.slider.magnet.state.empty": "Vacía",
      "web.slider.magnet.state.unknown": "Desconocida",
      "web.slider.relationship.includedComponents": "Componentes incluidos",
      "web.slider.relationship.includedInsert": "Inserto incluido",
      "web.slider.component.plateSet": "Juego de placas",
      "web.slider.component.insertSet": "Juego de insertos",
      "web.slider.component.spare": "Repuesto",
      "web.slider.search.matchedAliasContext": "Alias coincidente: {alias}",
      "web.slider.filter.spinnerButton": "Botón de spinner",
      "web.slider.privacy.inherited": "Privacidad heredada",
      "web.slider.moderation.blockedTitle": "Acción bloqueada",
      "web.slider.empty.noOffers":
        "No hay ofertas de configuración disponibles.",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }

  const sliderKeys = translationKeys.filter((key) =>
    key.startsWith("web.slider."),
  );
  assert.ok(sliderKeys.length >= 80);
  assert.ok(
    sliderKeys.every(
      (key) =>
        translations["en-US"][key].trim() && translations["es-MX"][key].trim(),
    ),
  );
  assert.ok(
    sliderKeys.every(
      (key) => !/(?:magnus|novel|fidgetboy|cage|cassette)/i.test(key),
    ),
  );

  assert.equal(
    formatTranslation(
      "web.slider.search.matchedAliasContext",
      { alias: "Cage" },
      "es-MX",
    ),
    "Alias coincidente: Cage",
  );
  assert.match(
    translations["en-US"]["web.slider.privacy.inheritedHelp"],
    /pointer, keyboard, or touch/,
  );
  assert.match(
    translations["es-MX"]["web.slider.privacy.inheritedHelp"],
    /puntero, teclado o toque/,
  );
});

test("product approval copy is complete in both supported locales", () => {
  const expected = {
    "en-US": {
      "web.catalog.approval.approve": "Approve product",
      "web.catalog.approval.collectionItem.approve": "Approve collection item",
      "web.catalog.approval.collectionItem.reject": "Reject collection item",
      "web.catalog.approval.collectionItem.title": "Collection item approval",
      "web.catalog.approval.status.pending": "Pending review",
      "web.catalog.approval.title": "Product approval",
    },
    "es-MX": {
      "web.catalog.approval.approve": "Aprobar producto",
      "web.catalog.approval.collectionItem.approve":
        "Aprobar artículo de la colección",
      "web.catalog.approval.collectionItem.reject":
        "Rechazar artículo de la colección",
      "web.catalog.approval.collectionItem.title":
        "Aprobación del artículo de la colección",
      "web.catalog.approval.status.pending": "Pendiente de revisión",
      "web.catalog.approval.title": "Aprobación del producto",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }
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
    "web.action.deleteCover",
    "web.collections.add.title",
    "web.collections.cover.deleteConfirmation",
    "web.collections.cover.history",
    "web.collections.edit.title",
    "web.collections.emptyCollections",
    "web.collections.error.chooseCollection",
    "web.collections.error.syncIncomplete",
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

test("collection gallery copy is localized in English and Spanish", () => {
  assert.equal(
    formatTranslation("web.action.uploadImages", {}, "en-US"),
    "Upload images",
  );
  assert.equal(
    formatTranslation("web.action.uploadImages", {}, "es-MX"),
    "Subir imágenes",
  );
  assert.equal(
    formatTranslation(
      "web.collections.gallery.pageStatus",
      { page: 2, pageCount: 3 },
      "es-MX",
    ),
    "Página 2 de 3",
  );
  assert.equal(
    formatTranslation(
      "web.collections.gallery.owner",
      { owner: "royanger" },
      "en-US",
    ),
    "Owner: royanger",
  );
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

test("markdown editor copy covers controls, links, status, and limits", () => {
  const english = {
    "web.markdownEditor.mode.visual": "Visual",
    "web.markdownEditor.mode.source": "Source",
    "web.markdownEditor.toolbar.heading1": "Heading 1",
    "web.markdownEditor.toolbar.heading2": "Heading 2",
    "web.markdownEditor.toolbar.heading3": "Heading 3",
    "web.markdownEditor.toolbar.bold": "Bold",
    "web.markdownEditor.toolbar.italic": "Italic",
    "web.markdownEditor.toolbar.strikethrough": "Strikethrough",
    "web.markdownEditor.toolbar.link": "Link",
    "web.markdownEditor.toolbar.unorderedList": "Bulleted list",
    "web.markdownEditor.toolbar.orderedList": "Numbered list",
    "web.markdownEditor.toolbar.table": "Table",
    "web.markdownEditor.toolbar.horizontalRule": "Horizontal rule",
    "web.markdownEditor.toolbar.blockquote": "Blockquote",
    "web.markdownEditor.link.text": "Link text",
    "web.markdownEditor.link.url": "URL",
    "web.markdownEditor.link.insert": "Insert link",
    "web.markdownEditor.link.update": "Update link",
    "web.markdownEditor.link.remove": "Remove link",
    "web.markdownEditor.link.invalidUrl":
      "Enter a relative, HTTP, or HTTPS URL.",
    "web.markdownEditor.status.loading": "Loading Markdown editor.",
    "web.markdownEditor.status.fallback":
      "The visual editor couldn't load. Continue editing in Source mode.",
    "web.markdownEditor.count.characters.normal":
      "{current} / {limit} characters",
    "web.markdownEditor.count.characters.warning":
      "{current} / {limit} characters, approaching limit",
    "web.markdownEditor.count.characters.limitReached":
      "{current} / {limit} characters, limit reached",
    "web.markdownEditor.count.characters.overLimit":
      "{current} / {limit} characters, {over} over limit",
    "web.markdownEditor.count.words.normal": "{current} / {limit} words",
    "web.markdownEditor.count.words.warning":
      "{current} / {limit} words, approaching limit",
    "web.markdownEditor.count.words.limitReached":
      "{current} / {limit} words, limit reached",
    "web.markdownEditor.count.words.overLimit":
      "{current} / {limit} words, {over} over limit",
  };

  for (const [key, value] of Object.entries(english)) {
    assert.ok(translationKeys.includes(key));
    assert.equal(translations["en-US"][key], value);
    assert.equal(translations["es-MX"][key], value);
  }

  assert.equal(
    formatTranslation(
      "web.markdownEditor.count.characters.overLimit",
      { current: 5_012, limit: 5_000, over: 12 },
      "en-US",
    ),
    "5012 / 5000 characters, 12 over limit",
  );
  assert.equal(
    formatTranslation(
      "web.markdownEditor.count.words.limitReached",
      { current: 200, limit: 200 },
      "es-MX",
    ),
    "200 / 200 words, limit reached",
  );
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
    "Allowed file types: STL, 3MF, STEP, STP, PDF, TXT, ZIP, JPEG, PNG, WebP, and AVIF.",
  );
  assert.equal(
    translations["es-MX"]["web.resources.upload.fileTypes"],
    "Tipos de archivo permitidos: STL, 3MF, STEP, STP, PDF, TXT, ZIP, JPEG, PNG, WebP y AVIF.",
  );
  assert.equal(
    translations["en-US"]["web.resources.upload.imageTypes"],
    "Allowed image types: JPEG, PNG, WebP, and AVIF.",
  );
  assert.equal(
    translations["es-MX"]["web.resources.upload.imageTypes"],
    "Tipos de imagen permitidos: JPEG, PNG, WebP y AVIF.",
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
