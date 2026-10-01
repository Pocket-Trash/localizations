import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  changelogCategories,
  getChangelogCategoryTitle,
  translationKeys,
  translations,
} from "../dist/index.js";

test("exports localized changelog categories and interface copy", () => {
  assert.deepEqual(changelogCategories, {
    feature: {
      slug: "feature",
      titles: {
        "en-US": "New Feature",
        "es-MX": "Nueva funcionalidad",
      },
    },
    bug: {
      slug: "bug",
      titles: { "en-US": "Bug", "es-MX": "Error" },
    },
    "product-support": {
      slug: "product-support",
      titles: {
        "en-US": "Product Support",
        "es-MX": "Compatibilidad con productos",
      },
    },
    improvement: {
      slug: "improvement",
      titles: { "en-US": "Improvement", "es-MX": "Mejora" },
    },
  });
  assert.equal(getChangelogCategoryTitle("feature", "fr-CA"), "New Feature");

  const expected = {
    "en-US": {
      "web.navigation.changelog": "Changelog",
      "web.changelog.allCategories": "All categories",
      "web.changelog.datePublished": "Date",
      "web.changelog.dateModified": "Date Modified",
      "web.changelog.copyLink": "Copy link",
      "web.changelog.linkCopied": "Link copied",
      "web.changelog.copyFailed": "Couldn’t copy link",
      "web.changelog.previousPage": "Previous page",
      "web.changelog.nextPage": "Next page",
      "web.changelog.pageStatus": "Page {page} of {pageCount}",
      "web.changelog.empty": "No changelog entries yet.",
      "web.changelog.emptyCategory": "No entries in this category.",
    },
    "es-MX": {
      "web.navigation.changelog": "Registro de cambios",
      "web.changelog.allCategories": "Todas las categorías",
      "web.changelog.datePublished": "Fecha",
      "web.changelog.dateModified": "Fecha de modificación",
      "web.changelog.copyLink": "Copiar enlace",
      "web.changelog.linkCopied": "Enlace copiado",
      "web.changelog.copyFailed": "No se pudo copiar el enlace",
      "web.changelog.previousPage": "Página anterior",
      "web.changelog.nextPage": "Página siguiente",
      "web.changelog.pageStatus": "Página {page} de {pageCount}",
      "web.changelog.empty": "Aún no hay entradas en el registro de cambios.",
      "web.changelog.emptyCategory": "No hay entradas en esta categoría.",
    },
  };

  for (const [locale, entries] of Object.entries(expected)) {
    for (const [key, value] of Object.entries(entries)) {
      assert.ok(translationKeys.includes(key));
      assert.equal(translations[locale][key], value);
    }
  }
});

test("exports the localized launch entry with canonical English metadata", () => {
  const filename = "2027-10-02-introducing-the-pocket-trash-changelog.mdx";
  const english = readFileSync(
    new URL(
      import.meta.resolve(
        `@pocket-trash/localizations/changelog/en-US/${filename}`,
      ),
    ),
    "utf8",
  );
  const spanish = readFileSync(
    new URL(
      import.meta.resolve(
        `@pocket-trash/localizations/changelog/es-MX/${filename}`,
      ),
    ),
    "utf8",
  );

  assert.equal(
    english,
    `---
title: Introducing the Pocket Trash changelog
datePublished: 2027-10-02
categories:
  - feature
---

You can now follow customer-facing Pocket Trash updates in the product changelog. Browse updates by category and share a direct link to any entry.
`,
  );
  assert.equal(
    spanish,
    `---
title: Presentamos el registro de cambios de Pocket Trash
---

Ahora puedes consultar las novedades de Pocket Trash en el registro de cambios del producto. Explora las novedades por categoría y comparte un enlace directo a cualquier entrada.
`,
  );
});
