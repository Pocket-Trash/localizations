import type { CompleteLocalizationResource } from '../types/localization.js';

/**
 * English (United States) translations for Pocket Trash.
 *
 * This catalog is checked against `CompleteLocalizationResource` from
 * `src/types/localization.ts`. When adding a translation key, update that type
 * first, then add the required English string here. Other locale catalogs can
 * omit most new keys until a translation is available; omitted keys fall back to
 * this `en-US` catalog at runtime.
 */
export const enUS = {
  app: {
    name: 'Pocket Trash',
  },
  action: {
    cancel: 'Cancel',
    save: 'Save',
  },
  error: {
    generic: 'Something went wrong.',
  },
  locale: {
    current: 'Current language: {locale}',
  },
} satisfies CompleteLocalizationResource;
