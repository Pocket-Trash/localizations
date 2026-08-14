import type { LocalizationResource } from "../types/localization.js";

/**
 * Spanish (Mexico) translations for Pocket Trash.
 *
 * This catalog is checked against `LocalizationResource` from
 * `src/types/localization.ts`. When adding a translation key, update that type
 * first, add the required English string in `src/localizations/en-US.ts`, then
 * add this locale's translation when available. Most new keys should remain
 * optional in the type so this catalog can omit untranslated strings and fall
 * back to `en-US` at runtime.
 */
export const esMX = {
  app: {
    name: "Pocket Trash",
  },
  action: {
    cancel: "Cancelar",
    save: "Guardar",
  },
  error: {
    generic: "Algo salio mal.",
  },
  locale: {
    current: "Idioma actual: {locale}",
  },
} satisfies LocalizationResource;
