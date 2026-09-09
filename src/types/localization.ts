type DotPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends object
      ? `${K}.${DotPaths<T[K]>}`
      : never;
}[keyof T & string];

type DeepPartial<T> = {
  readonly [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

export type CompleteLocalizationResource = Readonly<{
  app: {
    name: string;
  };
  action: {
    cancel: string;
    save: string;
  };
  error: {
    generic: string;
  };
  locale: {
    current: string;
  };
  web: {
    site: {
      name: string;
    };
    action: {
      archive: string;
      clearAllFilters: string;
      close: string;
      edit: string;
      saveFlag: string;
      search: string;
      signIn: string;
      visitProductPage: string;
    };
    admin: {
      featureFlags: {
        actions: string;
        adminOnlyTargeting: string;
        audience: string;
        booleanControls: string;
        description: string;
        displayName: string;
        editFlag: string;
        emailUsernameOrName: string;
        featureFlags: string;
        flag: string;
        flags: string;
        globalDefaultEnabled: string;
        newFlag: string;
        searchUsers: string;
        slugPlaceholder: string;
      };
    };
    archive: {
      closeSearch: string;
      controls: string;
      defaultPenDescription: string;
      filterDescription: string;
      filters: string;
      itemCount: string;
      noDescription: string;
      noItems: string;
      searchPlaceholder: string;
      searchProducts: string;
      sortLabel: string;
      sortProducts: string;
      sortDescription: string;
      footer: {
        fanMade: string;
        productOwnership: string;
        resourceFor: string;
        suggestionsOrContact: string;
        discord: string;
      };
      headline: {
        grip: string;
        mechanism: string;
        pen: string;
      };
      lightbox: {
        archived: string;
        closeProductDetails: string;
        nextImage: string;
        previousImage: string;
        released: string;
        specsDescription: string;
      };
      filter: {
        all: string;
        any: string;
        matchMode: string;
        bodyDetails: string;
        category: string;
        clip: string;
        finish: string;
        material: string;
        mechanism: string;
        refill: string;
        size: string;
        tipNose: string;
      };
      sort: {
        newestDrop: string;
        oldestDrop: string;
        priceLowToHigh: string;
        priceHighToLow: string;
        weightLightToHeavy: string;
        weightHeavyToLight: string;
        diameterThinToThick: string;
        diameterThickToThin: string;
        titleAToZ: string;
      };
      spec: {
        diameter: string;
        length: string;
        model: string;
        price: string;
        weight: string;
      };
      state: {
        archived: string;
      };
    };
    currency: {
      aud: string;
      cad: string;
      chf: string;
      eur: string;
      gbp: string;
      jpy: string;
      nzd: string;
      usd: string;
    };
    error: {
      expectedJsonRequestBody: string;
      invalidCurrencyCode: string;
      invalidDimensionUnit: string;
      invalidLocale: string;
      invalidLogClientKey: string;
      invalidTheme: string;
      invalidWeightUnit: string;
      missingSetting: string;
      settingsSaveFailed: string;
      userSettingsObject: string;
    };
    navigation: {
      account: string;
      accountMenu: string;
      betaFeatures: string;
      collections: string;
      language: string;
      logOut: string;
      user: string;
    };
    locale: {
      enUS: string;
      esMX: string;
    };
    page: {
      betaFeatures: {
        empty: string;
      };
      collections: {
        empty: string;
      };
      notFound: {
        description: string;
        returnToArchive: string;
        title: string;
        unavailable: string;
      };
    };
    settings: {
      about: string;
      aboutDescription: string;
      currency: string;
      dark: string;
      dimensionUnits: string;
      dimensions: string;
      displayCurrency: string;
      displayPreferences: string;
      displayPreferencesMachinedPens: string;
      grams: string;
      inches: string;
      language: string;
      light: string;
      millimeters: string;
      settings: string;
      system: string;
      theme: string;
      weight: string;
      weightUnits: string;
      ounces: string;
    };
    sidebar: {
      close: string;
      description: string;
      sidebar: string;
      toggle: string;
    };
    status: {
      disabled: string;
      enabled: string;
      failedToLoad: string;
    };
  };
}>;

export type TranslationKey = DotPaths<CompleteLocalizationResource>;

export type Translations = Readonly<Record<TranslationKey, string>>;

export type LocalizationResource = DeepPartial<CompleteLocalizationResource>;
