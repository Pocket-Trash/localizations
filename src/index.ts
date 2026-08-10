import { esMX } from '@clerk/localizations';

export type SupportedLocale = 'en' | 'es-MX';
export type MessageKey =
  | 'app.name'
  | 'action.cancel'
  | 'action.save'
  | 'error.generic'
  | 'locale.current';
export type Messages = Readonly<Record<MessageKey, string>>;
export type LocalePreference = string | readonly string[] | null | undefined;
export type ClerkLocalizationResource = typeof esMX;

export const DEFAULT_LOCALE = 'en' satisfies SupportedLocale;
export const SUPPORTED_LOCALES = Object.freeze(['en', 'es-MX'] as const);

const localeAliases = new Map<string, SupportedLocale>([
  ['en', 'en'],
  ['en-us', 'en'],
  ['en-ca', 'en'],
  ['es', 'es-MX'],
  ['es-mx', 'es-MX'],
  ['es-us', 'es-MX'],
]);

export const messages = Object.freeze({
  en: Object.freeze({
    'app.name': 'Field Log',
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'error.generic': 'Something went wrong.',
    'locale.current': 'Current language: {locale}',
  }),
  'es-MX': Object.freeze({
    'app.name': 'Field Log',
    'action.cancel': 'Cancelar',
    'action.save': 'Guardar',
    'error.generic': 'Algo salio mal.',
    'locale.current': 'Idioma actual: {locale}',
  }),
} satisfies Record<SupportedLocale, Messages>);

export const messageKeys = Object.freeze(Object.keys(messages[DEFAULT_LOCALE]) as MessageKey[]);

export const clerkLocalizations = Object.freeze({
  en: undefined,
  'es-MX': esMX,
} satisfies Record<SupportedLocale, ClerkLocalizationResource | undefined>);

export function resolveLocale(...preferences: readonly LocalePreference[]): SupportedLocale {
  for (const preference of preferences.flat()) {
    for (const tag of parseLocalePreference(preference)) {
      const locale = matchLocale(tag);
      if (locale) return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function getMessages(locale?: string | null): Messages {
  return messages[resolveLocale(locale)];
}

export function getClerkLocalization(locale?: string | null): ClerkLocalizationResource | undefined {
  return clerkLocalizations[resolveLocale(locale)];
}

export function formatMessage(
  key: MessageKey | string,
  values: Readonly<Record<string, unknown>> = {},
  locale: string | null = DEFAULT_LOCALE,
): string {
  const template = getMessages(locale)[key as MessageKey] ?? messages[DEFAULT_LOCALE][key as MessageKey];
  if (!template) return key;

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name: string) =>
    values[name] == null ? `{${name}}` : String(values[name]),
  );
}

export function assertCompleteCatalogs(): true {
  const expected = new Set(messageKeys);

  for (const [locale, catalog] of Object.entries(messages)) {
    const keys = Object.keys(catalog);
    const missing = messageKeys.filter((key) => !(key in catalog));
    const extra = keys.filter((key) => !expected.has(key as MessageKey));

    if (missing.length || extra.length) {
      throw new Error(
        `${locale} catalog mismatch: missing ${missing.join(', ') || 'none'}; extra ${extra.join(', ') || 'none'}`,
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
  return localeAliases.get(normalized) ?? localeAliases.get(normalized.split('-')[0] ?? '') ?? null;
}

assertCompleteCatalogs();
