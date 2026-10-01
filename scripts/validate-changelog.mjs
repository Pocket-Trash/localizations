import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { changelogCategories } from "../src/changelog-categories.js";

const categorySlugs = new Set(Object.keys(changelogCategories));
const filenamePattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/;

export function validateChangelog(root, { changedFiles = [] } = {}) {
  const englishFilenames = new Set(validateLocale(root, "en-US", true));
  const locales = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "en-US")
    .map((entry) => entry.name);

  for (const locale of locales) {
    for (const filename of validateLocale(root, locale, false)) {
      if (!englishFilenames.has(filename)) {
        throw new Error(`${locale}/${filename} has no English source.`);
      }
    }
  }

  validateTranslationChanges(root, locales, changedFiles);

  return true;
}

function validateTranslationChanges(root, locales, changedFiles) {
  const normalized = changedFiles.map((filename) =>
    filename.replaceAll("\\", "/"),
  );
  const changedEnglish = normalized.filter((filename) =>
    filename.includes("/en-US/"),
  );

  for (const englishPath of changedEnglish) {
    const filename = englishPath.slice(englishPath.lastIndexOf("/") + 1);
    for (const locale of locales) {
      if (
        existsSync(path.join(root, locale, filename)) &&
        !normalized.some((changed) =>
          changed.endsWith(`/${locale}/${filename}`),
        )
      ) {
        throw new Error(
          `${locale} translation must be updated or removed when ${filename} changes.`,
        );
      }
    }
  }
}

function validateLocale(root, locale, canonical) {
  const directory = path.join(root, locale);
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).map((entry) => {
    if (!entry.isFile() || !filenamePattern.test(entry.name)) {
      throw new Error(`${locale}/${entry.name} has an invalid filename.`);
    }

    const source = readFileSync(path.join(root, locale, entry.name), "utf8");
    const { metadata, body } = parseEntry(source, `${locale}/${entry.name}`);
    if (!body.trim()) throw new Error(`${locale}/${entry.name} is empty.`);

    if (canonical) validateCanonicalMetadata(entry.name, metadata);
    else validateTranslationMetadata(`${locale}/${entry.name}`, metadata);

    return entry.name;
  });
}

function parseEntry(source, filename) {
  // ponytail: this parser covers the documented frontmatter shape; use a YAML
  // parser if changelog metadata grows beyond scalar fields and string lists.
  const match = source.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/,
  );
  if (!match) throw new Error(`${filename} has invalid frontmatter.`);

  const metadata = {};
  let listKey;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^ {2}- (.+)$/);
    if (item && listKey) {
      metadata[listKey].push(item[1]);
      continue;
    }

    const field = line.match(/^([a-zA-Z][a-zA-Z0-9]*):(?: (.*))?$/);
    if (!field) throw new Error(`${filename} has invalid frontmatter.`);
    const [, key, value] = field;
    if (Object.hasOwn(metadata, key)) {
      throw new Error(`${filename} has duplicate metadata: ${key}.`);
    }
    metadata[key] = value ?? [];
    listKey = value == null ? key : undefined;
  }

  return { metadata, body: match[2] };
}

function validateCanonicalMetadata(filename, metadata) {
  const allowed = new Set([
    "title",
    "datePublished",
    "dateModified",
    "categories",
  ]);
  if (Object.keys(metadata).some((key) => !allowed.has(key))) {
    throw new Error(`en-US/${filename} has unsupported metadata.`);
  }
  if (typeof metadata.title !== "string" || !metadata.title.trim()) {
    throw new Error(`en-US/${filename} has no title.`);
  }
  if (!validDate(metadata.datePublished)) {
    throw new Error(`en-US/${filename} has an invalid publication date.`);
  }
  if (
    metadata.dateModified !== undefined &&
    !validDate(metadata.dateModified)
  ) {
    throw new Error(`en-US/${filename} has an invalid modification date.`);
  }
  if (filename.slice(0, 10) !== metadata.datePublished) {
    throw new Error(`en-US/${filename} does not match its publication date.`);
  }
  if (
    !Array.isArray(metadata.categories) ||
    metadata.categories.length === 0 ||
    metadata.categories.some((category) => !categorySlugs.has(category))
  ) {
    throw new Error(`en-US/${filename} has invalid categories.`);
  }
}

function validateTranslationMetadata(filename, metadata) {
  if (
    Object.keys(metadata).length !== 1 ||
    typeof metadata.title !== "string" ||
    !metadata.title.trim()
  ) {
    throw new Error(`${filename} must contain only a title.`);
  }
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function main(args) {
  let root = fileURLToPath(new URL("../changelog", import.meta.url));
  let changedSince;

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--changed-since") {
      changedSince = args[index + 1];
      if (!changedSince) throw new Error("--changed-since requires a git ref.");
      index += 1;
    } else {
      root = path.resolve(args[index]);
    }
  }

  const changedFiles = changedSince
    ? execFileSync("git", ["diff", "--name-only", `${changedSince}...HEAD`], {
        encoding: "utf8",
      })
        .trim()
        .split("\n")
        .filter(Boolean)
    : [];

  validateChangelog(root, { changedFiles });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
