# @pocket-trash/localizations

Shared localization utilities and translation catalogs for Pocket Trash.

## Install

```sh
npm install @pocket-trash/localizations
```

## Quick Start

```ts
import { formatTranslation, resolveLocale } from '@pocket-trash/localizations';

const locale = resolveLocale('es-MX');
const label = formatTranslation('action.save', {}, locale);
```

`label` is `"Guardar"`.

## Formatting Translations

Use `formatTranslation(key, values, locale)` when you need one translated
string.

```ts
import { formatTranslation } from '@pocket-trash/localizations';

formatTranslation('action.save');
formatTranslation('locale.current', { locale: 'es-MX' }, 'es-MX');
```

The second argument is the placeholder values object. Pass `{}` when the
translation does not need any values.

```ts
formatTranslation('action.save', {}, 'es-MX');
```

For translations with placeholders, pass the placeholder names and values:

```ts
formatTranslation('locale.current', { locale: 'es-MX' }, 'es-MX');
```

That fills `{locale}` in this translation:

```ts
export const esMX = {
  locale: {
    current: 'Idioma actual: {locale}',
  },
};
```

If a placeholder value is missing, the placeholder stays in the string. That
makes missing data visible instead of silently deleting text.

## Resolving Locales

Use `resolveLocale()` before formatting when locale input comes from a browser,
request header, user setting, or other string source.

```ts
import { resolveLocale } from '@pocket-trash/localizations';

const locale = resolveLocale('fr-CA', 'es-MX');
// locale is "es-MX"
```

`resolveLocale()` returns a TypeScript-safe `SupportedLocale`.

```ts
import type { SupportedLocale } from '@pocket-trash/localizations';

const locale: SupportedLocale = resolveLocale('nl-BE');
// locale is "en-US" because nl-BE is not supported
```

Passing an unsupported locale to `resolveLocale()` does not throw. It falls
back to `en-US`.

```ts
const locale = resolveLocale('nl-BE');
formatTranslation('action.save', {}, locale);
// "Save"
```

The `locale` parameter on `formatTranslation()` is TypeScript-safe. Passing an
unsupported literal like `'nl-BE'` directly is a type error.

```ts
formatTranslation('action.save', {}, 'nl-BE');
// TypeScript error: "nl-BE" is not assignable to SupportedLocale
```

Use `resolveLocale()` for raw external input. It returns a supported locale that
can be passed to `formatTranslation()`.

## TypeScript Safety

Translation keys are type-safe when you use a known key.

```ts
import type { TranslationKey } from '@pocket-trash/localizations';

const key: TranslationKey = 'action.save';
```

The current translation keys are:

```ts
type TranslationKey =
  | 'app.name'
  | 'action.cancel'
  | 'action.save'
  | 'error.generic'
  | 'locale.current';
```

`formatTranslation()` only accepts known `TranslationKey` values. Unknown keys
are TypeScript errors.

```ts
formatTranslation('unknown.key');
// TypeScript error: "unknown.key" is not assignable to TranslationKey
```

## Getting a Whole Catalog

Use `getTranslations()` when you need all translations for a locale.

```ts
import { getTranslations } from '@pocket-trash/localizations';

const translations = getTranslations('es-MX');
const save = translations['action.save'];
```

Returned catalogs are complete. If a non-English locale omits a translation,
or has a blank string, that key falls back to the `en-US` value.

## Clerk Localizations

Use `getClerkLocalization()` when configuring Clerk UI components.

```ts
import { getClerkLocalization, resolveLocale } from '@pocket-trash/localizations';

const locale = resolveLocale('es-MX');
const localization = getClerkLocalization(locale);
```

English returns `undefined`, so Clerk uses its default English strings. Spanish
returns Clerk's `esMX` localization.

## Adding Translations

Source locale files use nested objects:

```ts
export const enUS = {
  app: {
    name: 'Pocket Trash',
  },
  action: {
    cancel: 'Cancel',
    save: 'Save',
  },
};
```

Callers still use dot keys:

```ts
formatTranslation('action.save');
```

Add new translation keys in two places:

1. Add the nested field to `CompleteLocalizationResource` in `src/types/localization.ts`.
2. Add the required English value to `src/localizations/en-US.ts`.
3. Run `pnpm localization:sync`.
4. Fill in translated values when available.
5. Run `pnpm test`.

Non-English locale files can omit new keys until translations are ready. Missing
or blank keys fall back to `en-US` at runtime.

## Scaffolding a Locale

Create and wire a new locale:

```sh
pnpm localization:create nl-BE
```

That command:

1. Creates `src/localizations/nl-BE.ts`.
2. Copies the nested `en-US` shape with every value set to `''`.
3. Adds the locale to `SupportedLocale`, `SUPPORTED_LOCALES`, `localizations`,
   and `translations`.
4. Adds a Clerk localization mapping if `@clerk/localizations` exports one.

Sync missing keys into existing non-English locales:

```sh
pnpm localization:sync
```

`en-US` is the source of truth. Sync adds missing nested keys with blank values
and preserves existing translations.

## Develop

Use `pnpm dev` when working on this package from another app. It runs the same
TypeScript build as `pnpm build`, but watches files and rebuilds `dist/` on
changes.

```sh
pnpm dev
```

From the app that consumes this package, link the local package:

```sh
pnpm link /path/to/field-log-localizations
```

More details live in [docs/local-development.md](docs/local-development.md).

```sh
pnpm install
pnpm dev
pnpm test
pnpm localization:create nl-BE
pnpm localization:sync
```

Publishing notes live in [docs/publishing.md](docs/publishing.md).
