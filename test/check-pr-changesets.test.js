import assert from "node:assert/strict";
import test from "node:test";

import { checkChangesets } from "../scripts/check-pr-changesets.mjs";

test("fails when there is no changeset", () => {
  assert.deepEqual(
    checkChangesets([{ filename: "src/index.ts", content: "" }]),
    {
      bump: null,
      hasRelease: false,
    },
  );
});

test("fails for empty changesets", () => {
  assert.deepEqual(
    checkChangesets([
      { filename: ".changeset/empty.md", content: "---\n---\nNo release." },
    ]),
    {
      bump: null,
      hasRelease: false,
    },
  );
});

test("passes for patch and minor changesets", () => {
  assert.deepEqual(
    checkChangesets([
      {
        filename: ".changeset/fix.md",
        content: '---\n"@pocket-trash/localizations": patch\n---\nFix copy.',
      },
      {
        filename: ".changeset/add.md",
        content: '---\n"@pocket-trash/localizations": minor\n---\nAdd copy.',
      },
    ]),
    {
      bump: "minor",
      hasRelease: true,
    },
  );
});

test("detects major changesets", () => {
  assert.deepEqual(
    checkChangesets([
      {
        filename: ".changeset/break.md",
        content: '---\n"@pocket-trash/localizations": major\n---\nBreak API.',
      },
    ]),
    {
      bump: "major",
      hasRelease: true,
    },
  );
});
