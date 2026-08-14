import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const sourceLocale = "en-US";

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , command, locale] = process.argv;

  if (command === "create") {
    if (!locale) usage();
    createLocalization(locale);
  } else if (command === "sync") {
    syncLocalizations();
  } else {
    usage();
  }
}

export function createLocalization(locale, options = {}) {
  const cwd = options.cwd ?? root;
  const paths = getPaths(cwd);
  const filePath = path.join(paths.localizationsDir, `${locale}.ts`);

  if (!/^[a-z]{2,3}-[A-Z]{2}$/.test(locale)) {
    throw new Error(`Locale must look like nl-BE or pt-BR: ${locale}`);
  }

  if (fs.existsSync(filePath)) {
    throw new Error(`${filePath} already exists`);
  }

  const source = readLocalization(
    path.join(paths.localizationsDir, `${sourceLocale}.ts`),
  );
  writeLocalization(filePath, locale, blankValues(source));
  wireLocale(paths.indexPath, locale, detectClerkExport(locale, cwd));
}

export function syncLocalizations(options = {}) {
  const cwd = options.cwd ?? root;
  const paths = getPaths(cwd);
  const source = readLocalization(
    path.join(paths.localizationsDir, `${sourceLocale}.ts`),
  );

  for (const entry of fs.readdirSync(paths.localizationsDir)) {
    if (!entry.endsWith(".ts") || entry === `${sourceLocale}.ts`) continue;

    const locale = entry.slice(0, -3);
    const filePath = path.join(paths.localizationsDir, entry);
    const current = readLocalization(filePath);
    writeLocalization(filePath, locale, syncShape(source, current));
  }
}

function getPaths(cwd) {
  return {
    localizationsDir: path.join(cwd, "src/localizations"),
    indexPath: path.join(cwd, "src/index.ts"),
  };
}

function usage() {
  throw new Error(
    "Usage: pnpm localization:create <locale> or pnpm localization:sync",
  );
}

function readLocalization(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const literal = extractObjectLiteral(source);
  return vm.runInNewContext(`(${literal})`);
}

function extractObjectLiteral(source) {
  const marker = "export const ";
  const exportIndex = source.indexOf(marker);
  if (exportIndex === -1)
    throw new Error("Missing exported localization const");

  const start = source.indexOf("{", exportIndex);
  if (start === -1) throw new Error("Missing localization object");

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      escaped = char === "\\" && !escaped;
      if (char === quote && !escaped) quote = "";
      if (char !== "\\") escaped = false;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  throw new Error("Unclosed localization object");
}

function blankValues(value) {
  return mapLeaves(value, () => "");
}

function syncShape(source, current) {
  const synced = {};

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") {
      synced[key] = typeof current?.[key] === "string" ? current[key] : "";
    } else {
      synced[key] = syncShape(value, current?.[key]);
    }
  }

  for (const [key, value] of Object.entries(current ?? {})) {
    if (!(key in synced)) synced[key] = value;
  }

  return synced;
}

function mapLeaves(value, visit) {
  if (typeof value === "string") return visit(value);

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, mapLeaves(child, visit)]),
  );
}

function writeLocalization(filePath, locale, resource) {
  fs.writeFileSync(
    filePath,
    `import type { LocalizationResource } from '../types/localization.js';

/**
 * ${locale} translations for Pocket Trash.
 *
 * This catalog is checked against \`LocalizationResource\` from
 * \`src/types/localization.ts\`. When adding a translation key, update that type
 * first, add the required English string in \`src/localizations/en-US.ts\`, then
 * run \`pnpm localization:sync\` so this locale gets any missing blank fields.
 * Blank strings fall back to \`en-US\` at runtime until translated.
 */
export const ${localeVariable(locale)} = ${formatObject(resource)} satisfies LocalizationResource;
`,
  );
}

function formatObject(value, level = 0) {
  if (typeof value === "string") return `'${escapeString(value)}'`;

  const indent = "  ".repeat(level);
  const childIndent = "  ".repeat(level + 1);
  const entries = Object.entries(value)
    .map(
      ([key, child]) =>
        `${childIndent}${safeKey(key)}: ${formatObject(child, level + 1)},`,
    )
    .join("\n");

  return `{\n${entries}\n${indent}}`;
}

function safeKey(key) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
    ? key
    : `'${escapeString(key)}'`;
}

function escapeString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

function localeVariable(locale) {
  return locale
    .split("-")
    .map((part, index) =>
      index === 0 ? part.toLowerCase() : part.toUpperCase(),
    )
    .join("");
}

function clerkVariable(locale) {
  const variable = localeVariable(locale);
  return `clerk${variable[0].toUpperCase()}${variable.slice(1)}`;
}

function detectClerkExport(locale, cwd) {
  try {
    const indexPath = findClerkIndex(cwd);
    return indexPath
      ? new RegExp(`\\b${localeVariable(locale)}\\b`).test(
          fs.readFileSync(indexPath, "utf8"),
        )
      : false;
  } catch {
    return false;
  }
}

function findClerkIndex(cwd) {
  const direct = path.join(
    cwd,
    "node_modules/@clerk/localizations/dist/index.d.ts",
  );
  if (fs.existsSync(direct)) return direct;

  const pnpmDir = path.join(cwd, "node_modules/.pnpm");
  if (!fs.existsSync(pnpmDir)) return null;

  const packageDir = fs
    .readdirSync(pnpmDir)
    .find((entry) => entry.startsWith("@clerk+localizations@"));

  return packageDir
    ? path.join(
        pnpmDir,
        packageDir,
        "node_modules/@clerk/localizations/dist/index.d.ts",
      )
    : null;
}

function wireLocale(indexFilePath, locale, hasClerkExport) {
  const variable = localeVariable(locale);
  const clerk = clerkVariable(locale);
  let source = fs.readFileSync(indexFilePath, "utf8");

  source = source.replace(
    /import \{ ([^}]+) \} from ["']@clerk\/localizations["'];/,
    (_, imports) =>
      hasClerkExport
        ? `import { ${imports}, ${variable} as ${clerk} } from "@clerk/localizations";`
        : `import { ${imports} } from "@clerk/localizations";`,
  );
  source = source.replace(
    /(import \{ esMX \} from ["']\.\/localizations\/es-MX\.js["'];\n)/,
    `$1import { ${variable} } from "./localizations/${locale}.js";\n`,
  );
  source = source.replace(
    /(export \{ esMX \} from ["']\.\/localizations\/es-MX\.js["'];\n)/,
    `$1export { ${variable} } from "./localizations/${locale}.js";\n`,
  );
  source = source.replace(
    /export type SupportedLocale = ([^;]+);/,
    (_, union) => {
      if (union.includes(`'${locale}'`))
        return `export type SupportedLocale = ${union};`;
      return `export type SupportedLocale = ${union} | '${locale}';`;
    },
  );
  source = source.replace(
    /export const SUPPORTED_LOCALES = Object\.freeze\(\[([^\]]+)\] as const\);/,
    (_, locales) =>
      locales.includes(`'${locale}'`)
        ? `export const SUPPORTED_LOCALES = Object.freeze([${locales}] as const);`
        : `export const SUPPORTED_LOCALES = Object.freeze([${locales}, '${locale}'] as const);`,
  );
  source = source.replace(
    /(const localeAliases = new Map<string, SupportedLocale>\(\[\n)/,
    `$1  ['${locale.toLowerCase()}', '${locale}'],\n`,
  );
  source = source.replace(
    /(export const localizations = Object\.freeze\(\{\n[\s\S]*? {2}["']es-MX["']: esMX,\n)/,
    `$1  "${locale}": ${variable},\n`,
  );
  source = source.replace(
    /(export const translations = Object\.freeze\(\{\n[\s\S]*? {2}["']es-MX["']: Object\.freeze\(\n {4}mergeTranslations\(defaultTranslations, flattenLocalization\(esMX\)\),\n {2}\),\n)/,
    `$1  "${locale}": Object.freeze(mergeTranslations(defaultTranslations, flattenLocalization(${variable}))),\n`,
  );
  source = source.replace(
    /(export const clerkLocalizations: Readonly<[\s\S]*?> = Object\.freeze\(\{\n[\s\S]*? {2}["']es-MX["']: clerkEsMX,\n)/,
    `$1  "${locale}": ${hasClerkExport ? clerk : "undefined"},\n`,
  );

  fs.writeFileSync(indexFilePath, source);
}
