import { esMX as clerkEsMX } from '@clerk/localizations';

import { enUS } from './localizations/en-US.js';
import { esMX } from './localizations/es-MX.js';
import type {
  CompleteLocalizationResource,
  LocalizationResource,
  TranslationKey,
  Translations,
} from './types/localization.js';

export type {
  CompleteLocalizationResource,
  LocalizationResource,
  TranslationKey,
  Translations,
} from './types/localization.js';
export { enUS } from './localizations/en-US.js';
export { esMX } from './localizations/es-MX.js';

export type SupportedLocale = 'en-US' | 'es-MX';
export type MessageKey = TranslationKey;
export type Messages = Translations;
export type LocalePreference = string | readonly string[] | null | undefined;
export type ClerkLocalizationResource = typeof clerkEsMX;

export const DEFAULT_LOCALE = 'en-US' satisfies SupportedLocale;
export const SUPPORTED_LOCALES = Object.freeze(['en-US', 'es-MX'] as const);

const localeAliases = new Map<string, SupportedLocale>([
  ['es', 'es-MX'],
  ['es-mx', 'es-MX'],
  ['es-us', 'es-MX'],
  ['en-us', 'en-US'],
]);

export const localizations = Object.freeze({
  'en-US': enUS,
  'es-MX': esMX,
} satisfies Record<SupportedLocale, LocalizationResource>);

const defaultTranslations = flattenLocalization(enUS) as Translations;

export const translationKeys = Object.freeze(Object.keys(defaultTranslations) as TranslationKey[]);

export const translations = Object.freeze({
  'en-US': Object.freeze(defaultTranslations),
  'es-MX': Object.freeze(mergeTranslations(defaultTranslations, flattenLocalization(esMX))),
} satisfies Record<SupportedLocale, Translations>);

export const messages = translations;
export const messageKeys = translationKeys;

export const clerkLocalizations: Readonly<Record<SupportedLocale, ClerkLocalizationResource | undefined>> = Object.freeze({
  'en-US': undefined,
  'es-MX': clerkEsMX,
});

export function resolveLocale(...preferences: readonly LocalePreference[]): SupportedLocale {
  for (const preference of preferences.flat()) {
    for (const tag of parseLocalePreference(preference)) {
      const locale = matchLocale(tag);
      if (locale) return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function getTranslations(locale?: SupportedLocale | null): Translations {
  return translations[resolveLocale(locale)];
}

export const getMessages = getTranslations;

export function getClerkLocalization(locale?: SupportedLocale | null): ClerkLocalizationResource | undefined {
  return clerkLocalizations[resolveLocale(locale)];
}

export function formatTranslation(
  key: TranslationKey,
  values: Readonly<Record<string, unknown>> = {},
  locale: SupportedLocale | null = DEFAULT_LOCALE,
): string {
  const template = getTranslations(locale)[key] ?? translations[DEFAULT_LOCALE][key];
  if (!template) return key;

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name: string) =>
    values[name] == null ? `{${name}}` : String(values[name]),
  );
}

export const formatMessage = formatTranslation;

export function assertCompleteCatalogs(): true {
  const expected = new Set(translationKeys);

  for (const [locale, catalog] of Object.entries(localizations)) {
    const flatCatalog = flattenLocalization(catalog);
    const keys = Object.keys(flatCatalog);
    const missing = locale === DEFAULT_LOCALE ? translationKeys.filter((key) => !(key in flatCatalog)) : [];
    const empty = locale === DEFAULT_LOCALE ? translationKeys.filter((key) => flatCatalog[key] === '') : [];
    const extra = keys.filter((key) => !expected.has(key as TranslationKey));

    if (missing.length || empty.length || extra.length) {
      throw new Error(
        `${locale} catalog mismatch: missing ${missing.join(', ') || 'none'}; empty ${empty.join(', ') || 'none'}; extra ${extra.join(', ') || 'none'}`,
      );
    }
  }

  return true;
}

function parseLocalePreference(preference: string | null | undefined): string[] {
  if (typeof preference !== 'string' || !preference.trim()) return [];
  if (!preference.includes(',') && !preference.includes(';')) return [preference];

  return preference
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params
        .map((param) => param.trim().match(/^q=([0-9.]+)$/i)?.[1])
        .find(Boolean);

      return { tag, q: q == null ? 1 : Number(q), index };
    })
    .filter(({ tag, q }) => tag && Number.isFinite(q) && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map(({ tag }) => tag);
}

function matchLocale(tag: string): SupportedLocale | null {
  const normalized = tag.trim().replace('_', '-').toLowerCase();
  if (normalized === '*') return DEFAULT_LOCALE;
  return localeAliases.get(normalized) ?? null;
}

function flattenLocalization(resource: LocalizationResource): Partial<Record<TranslationKey, string>> {
  const entries: Partial<Record<TranslationKey, string>> = {};

  for (const [key, value] of flattenEntries(resource)) {
    entries[key as TranslationKey] = value;
  }

  return entries;
}

function flattenEntries(resource: Record<string, unknown>, prefix = ''): Array<[string, string]> {
  return Object.entries(resource).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') return [[path, value]];
    if (value && typeof value === 'object') return flattenEntries(value as Record<string, unknown>, path);
    return [];
  });
}

function mergeTranslations(
  defaults: Partial<Record<TranslationKey, string>>,
  overrides: Partial<Record<TranslationKey, string>>,
): Translations {
  return Object.fromEntries(
    translationKeys.map((key) => [key, overrides[key] === '' || overrides[key] == null ? defaults[key] : overrides[key]]),
  ) as Translations;
}

assertCompleteCatalogs();
