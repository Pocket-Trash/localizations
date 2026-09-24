import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("exports localized help sources with publishing metadata", () => {
  for (const [locale, title] of [
    ["en-US", "Image size and resolution guide"],
    ["es-MX", "Guía de tamaño y resolución de imágenes"],
  ]) {
    const source = readFileSync(
      new URL(
        import.meta.resolve(
          `@pocket-trash/localizations/help/${locale}/image-size-and-resolution-guide.mdx`,
        ),
      ),
      "utf8",
    );
    assert.ok(source.startsWith(`---\ntitle: ${title}\n`));
    assert.match(source, /\ndatePublished: \d{4}-\d{2}-\d{2}\n/);
    assert.match(source, /\ncategory: .+\n---\n/);
    assert.ok(source.includes("1200 × 900"));
  }
});
