import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateChangelog } from "../scripts/validate-changelog.mjs";

function fixture(entries) {
  const root = mkdtempSync(path.join(os.tmpdir(), "changelog-"));

  for (const [relativePath, content] of Object.entries(entries)) {
    const filename = path.join(root, relativePath);
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, content);
  }

  return root;
}

test("accepts English-only entries and matching translations", (context) => {
  const root = fixture({
    "en-US/2027-10-01-english-only.mdx": `---
title: English only
datePublished: 2027-10-01
categories:
  - improvement
---

English content.
`,
    "en-US/2027-10-02-localized-entry.mdx": `---
title: Localized entry
datePublished: 2027-10-02
dateModified: 2027-10-03
categories:
  - feature
  - product-support
---

English content.
`,
    "es-MX/2027-10-02-localized-entry.mdx": `---
title: Entrada localizada
---

Contenido en español.
`,
  });
  context.after(() => rmSync(root, { recursive: true }));

  assert.equal(validateChangelog(root), true);
});

test("rejects invalid filenames, metadata, categories, content, and translations", () => {
  const valid = `---
title: Valid entry
datePublished: 2027-10-02
categories:
  - feature
---

Content.
`;
  const cases = [
    {
      entries: { "en-US/not-dated.mdx": valid },
      error: /invalid filename/,
    },
    {
      entries: {
        "en-US/2027-02-30-invalid-date.mdx": valid.replace(
          "2027-10-02",
          "2027-02-30",
        ),
      },
      error: /invalid publication date/,
    },
    {
      entries: {
        "en-US/2027-10-02-invalid-category.mdx": valid.replace(
          "feature",
          "other",
        ),
      },
      error: /invalid categories/,
    },
    {
      entries: {
        "en-US/2027-10-02-empty.mdx": valid.replace("Content.", ""),
      },
      error: /is empty/,
    },
    {
      entries: {
        "en-US/2027-10-02-valid-entry.mdx": valid,
        "es-MX/2027-10-02-valid-entry.mdx": `---
title: Entrada válida
categories:
  - feature
---

Contenido.
`,
      },
      error: /must contain only a title/,
    },
    {
      entries: {
        "es-MX/2027-10-02-orphan.mdx": `---
title: Huérfana
---

Contenido.
`,
      },
      error: /has no English source/,
    },
  ];

  for (const { entries, error } of cases) {
    const root = fixture(entries);
    try {
      assert.throws(() => validateChangelog(root), error);
    } finally {
      rmSync(root, { recursive: true });
    }
  }
});

test("requires existing translations to follow English source changes", (context) => {
  const filename = "2027-10-02-localized-entry.mdx";
  const root = fixture({
    [`en-US/${filename}`]: `---
title: Localized entry
datePublished: 2027-10-02
categories:
  - feature
---

English content.
`,
    [`es-MX/${filename}`]: `---
title: Entrada localizada
---

Contenido en español.
`,
  });
  context.after(() => rmSync(root, { recursive: true }));

  assert.throws(
    () =>
      validateChangelog(root, {
        changedFiles: [`changelog/en-US/${filename}`],
      }),
    /es-MX translation must be updated or removed/,
  );
  assert.equal(
    validateChangelog(root, {
      changedFiles: [
        `changelog/en-US/${filename}`,
        `changelog/es-MX/${filename}`,
      ],
    }),
    true,
  );
});

test("runs validation as a repository command", () => {
  const root = fixture({
    "es-MX/2027-10-02-orphan.mdx": `---
title: Huérfana
---

Contenido.
`,
  });

  try {
    const result = spawnSync(
      process.execPath,
      [
        fileURLToPath(
          new URL("../scripts/validate-changelog.mjs", import.meta.url),
        ),
        root,
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /has no English source/);
  } finally {
    rmSync(root, { recursive: true });
  }
});
