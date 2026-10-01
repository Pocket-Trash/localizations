import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("exports the English privacy policy with publication metadata", () => {
  const source = readFileSync(
    new URL(
      import.meta.resolve(
        "@pocket-trash/localizations/legal/en-US/privacy-policy.mdx",
      ),
    ),
    "utf8",
  );

  assert.ok(source.startsWith("---\ntitle: Privacy Policy\n"));
  assert.match(source, /\neffectiveDate: \d{4}-\d{2}-\d{2}\n/);
  assert.match(source, /\nversion: \d+\.\d+\n---\n/);
  assert.ok(source.includes("privacy@pocket-trash.app"));
  assert.ok(source.includes("complete account erasure"));
});

test("exports the English Terms of Service with publication metadata", () => {
  const source = readFileSync(
    new URL(
      import.meta.resolve(
        "@pocket-trash/localizations/legal/en-US/terms-of-service.mdx",
      ),
    ),
    "utf8",
  );

  assert.ok(source.startsWith("---\ntitle: Terms of Service\n"));
  assert.match(source, /\neffectiveDate: \d{4}-\d{2}-\d{2}\n/);
  assert.match(source, /\nversion: \d+\.\d+\n---\n/);
  assert.ok(source.includes("privacy@pocket-trash.app"));
  assert.ok(source.includes("You must be at least 13"));
  assert.ok(source.includes("[Privacy Policy](/privacy)"));
});
