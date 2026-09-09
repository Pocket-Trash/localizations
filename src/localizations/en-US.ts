import type { CompleteLocalizationResource } from "../types/localization.js";

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
    name: "Pocket Trash",
  },
  action: {
    cancel: "Cancel",
    save: "Save",
  },
  error: {
    generic: "Something went wrong.",
  },
  locale: {
    current: "Current language: {locale}",
  },
  web: {
    site: {
      name: "Pocket Trash",
    },
    action: {
      archive: "Archive",
      clearAllFilters: "Clear all filters",
      close: "Close",
      edit: "Edit",
      saveFlag: "Save flag",
      search: "Search",
      signIn: "Sign in",
      visitProductPage: "Visit product page",
    },
    admin: {
      featureFlags: {
        actions: "Actions",
        adminOnlyTargeting: "Admin-only targeting",
        audience: "Audience",
        booleanControls:
          "Boolean controls for global, private, and beta surfaces.",
        description: "Description",
        displayName: "Display name",
        editFlag: "Edit flag",
        emailUsernameOrName: "Email, username, or name",
        featureFlags: "Feature flags",
        flag: "Flag",
        flags: "Flags",
        globalDefaultEnabled: "Global default enabled",
        newFlag: "New flag",
        searchUsers: "Search users",
        slugPlaceholder: "new-library-ui",
      },
    },
    archive: {
      closeSearch: "Close search",
      controls: "Archive controls",
      defaultPenDescription: "{siteName} pen.",
      filterDescription:
        "Filter the archive by category, size, material, and more.",
      filters: "Filters",
      itemCount: "{visible} of {total} items",
      noDescription: "(no description on file)",
      noItems: "No items match these filters.",
      searchPlaceholder: "Search...",
      searchProducts: "Search pens by title, specs, or description",
      sortLabel: "Sort",
      sortProducts: "Sort pens",
      sortDescription: "Choose how the archive is ordered.",
      footer: {
        fanMade: "Made by a fan; not affiliated with any maker.",
        productOwnership:
          "Product names, images, and descriptions remain the property of their respective owners.",
        resourceFor: "A resource for",
        suggestionsOrContact: "Suggestions or contact:",
        discord: "and the Machined Pens Discord.",
      },
      headline: {
        grip: "{size} Grip",
        mechanism: "{size} Mechanism",
        pen: "Pen",
      },
      lightbox: {
        archived: "Archived - no longer listed",
        closeProductDetails: "Close product details",
        nextImage: "Next image",
        previousImage: "Previous image",
        released: "Released",
        specsDescription:
          "Specs, materials, and release details for this product.",
      },
      filter: {
        all: "all",
        any: "any",
        matchMode: "{label} match mode",
        bodyDetails: "Body details",
        category: "Category",
        clip: "Clip",
        finish: "Finish",
        material: "Material",
        mechanism: "Mechanism",
        refill: "Refill",
        size: "Size",
        tipNose: "Tip / Nose",
      },
      sort: {
        newestDrop: "Newest drop",
        oldestDrop: "Oldest drop",
        priceLowToHigh: "Price low to high",
        priceHighToLow: "Price high to low",
        weightLightToHeavy: "Weight light to heavy",
        weightHeavyToLight: "Weight heavy to light",
        diameterThinToThick: "Diameter thin to thick",
        diameterThickToThin: "Diameter thick to thin",
        titleAToZ: "Title A to Z",
      },
      spec: {
        diameter: "Diameter",
        length: "Length",
        model: "Model",
        price: "Price",
        weight: "Weight",
      },
      state: {
        archived: "Archived",
      },
    },
    currency: {
      aud: "$ AUD",
      cad: "$ CAD (native)",
      chf: "CHF",
      eur: "EUR EUR",
      gbp: "GBP GBP",
      jpy: "JPY JPY",
      nzd: "$ NZD",
      usd: "$ USD",
    },
    error: {
      expectedJsonRequestBody: "Expected a JSON request body.",
      invalidCurrencyCode: "Expected a valid currency code.",
      invalidDimensionUnit: "Expected a valid dimension unit.",
      invalidLocale: "Expected a valid locale.",
      invalidLogClientKey: "Invalid log client key.",
      invalidTheme: "Expected a valid theme.",
      invalidWeightUnit: "Expected a valid weight unit.",
      missingSetting: "Expected at least one setting.",
      settingsSaveFailed: "We couldn't save your settings. Please try again.",
      userSettingsObject: "Expected a user settings object.",
    },
    navigation: {
      account: "Account",
      accountMenu: "Account menu",
      betaFeatures: "Beta features",
      collections: "Collections",
      language: "Language",
      logOut: "Log out",
      user: "User",
    },
    locale: {
      enUS: "English (US)",
      esMX: "Spanish (Mexico)",
    },
    page: {
      betaFeatures: {
        empty: "No beta features are available.",
      },
      collections: {
        empty: "Collections will be available later.",
      },
      notFound: {
        description: "This page does not exist or is no longer available.",
        returnToArchive: "Return to archive",
        title: "Not found",
        unavailable: "Page unavailable",
      },
    },
    settings: {
      about: "About",
      aboutDescription:
        "An unofficial archive of machined pen drops, with filters, specs, descriptions, and local image backups. Made by a fan; not affiliated with any maker.",
      currency: "Currency",
      dark: "Dark",
      dimensionUnits: "Dimension units",
      dimensions: "Dimensions",
      displayCurrency: "Display currency",
      displayPreferences: "Display preferences for the archive.",
      displayPreferencesMachinedPens: "Display preferences for Pocket Trash.",
      grams: "Grams",
      inches: "Inches",
      language: "Language",
      light: "Light",
      millimeters: "Millimeters",
      settings: "Settings",
      system: "System",
      theme: "Theme",
      weight: "Weight",
      weightUnits: "Weight units",
      ounces: "Ounces",
    },
    sidebar: {
      close: "Close sidebar",
      description: "Displays the mobile sidebar.",
      sidebar: "Sidebar",
      toggle: "Toggle sidebar",
    },
    status: {
      disabled: "Disabled",
      enabled: "Enabled",
      failedToLoad: "Failed to load.",
    },
  },
} satisfies CompleteLocalizationResource;
