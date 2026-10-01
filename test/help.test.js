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

test("exports the English Markdown guide as safe source-and-result pairs", () => {
  const source = readFileSync(
    new URL(
      import.meta.resolve(
        "@pocket-trash/localizations/help/en-US/how-to-use-markdown.mdx",
      ),
    ),
    "utf8",
  );
  const examples = [
    "# Main heading",
    "## Section heading",
    "### Subsection heading",
    "**Bold text**",
    "*Italic text*",
    "***Bold and italic text***",
    "~~Strikethrough text~~",
    "[Open the image guide](/help/image-size-and-resolution-guide)",
    "[Visit Pocket Trash](https://pocket-trash.app)",
    "- First item\n- Second item",
    "1. First step\n2. Second step",
    "| Item | Material | Finish |\n| --- | --- | --- |\n| Pen | Titanium | Stonewashed |\n| Notebook | Paper | Natural |",
    "---",
    "> Keep the details clear and useful.",
  ];

  assert.ok(source.startsWith("---\ntitle: How to Use Markdown\n"));
  assert.match(source, /\ndatePublished: \d{4}-\d{2}-\d{2}\n/);
  assert.match(source, /\ncategory: .+\n---\n/);
  assert.equal(source.match(/```markdown/g)?.length, examples.length);
  for (const example of examples) {
    assert.ok(
      source.includes(`\`\`\`markdown\n${example}\n\`\`\`\n\n${example}`),
    );
  }
  assert.match(source, /not accepted in user-editable Markdown fields/i);
  assert.doesNotMatch(source, /<[A-Z][A-Za-z0-9]*(?:\s|>)/);
});
