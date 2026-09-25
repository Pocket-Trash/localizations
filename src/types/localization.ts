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
      addCollection: string;
      addColor: string;
      addFinish: string;
      addFinishOption: string;
      addMaker: string;
      addMaterial: string;
      addProduct: string;
      addToCollection: string;
      archive: string;
      clearAllFilters: string;
      clearCover: string;
      close: string;
      confirmAdd: string;
      deleteCover: string;
      edit: string;
      more: string;
      moreFilters: string;
      moveFinishOptionDown: string;
      moveFinishOptionUp: string;
      removeFinishOption: string;
      removeSelection: string;
      saveFlag: string;
      search: string;
      selectCover: string;
      signIn: string;
      view: string;
      viewCollection: string;
      viewItem: string;
      viewProductDetails: string;
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
    catalog: {
      collectionsWithProduct: string;
      colorEffect: {
        fade: string;
        solid: string;
      };
      defaultButton: string;
      error: {
        bearingLength: string;
        colorHex: string;
        colorEffectRequired: string;
        colorEffectWithoutColors: string;
        descriptionLength: string;
        duplicate: string;
        duplicateComponent: string;
        duplicateFinishOption: string;
        fadeColors: string;
        finishOptionRequired: string;
        finishRequired: string;
        form: string;
        positive: string;
        productFinishRequired: string;
        productMaterialRequired: string;
        required: string;
        url: string;
      };
      field: {
        bearing: string;
        button: string;
        buttonDiameter: string;
        colorEffect: string;
        colorValue: string;
        colors: string;
        description: string;
        finishes: string;
        finishOptions: string;
        maker: string;
        makerProductUrl: string;
        materials: string;
        name: string;
        productType: string;
        rootUrl: string;
        slug: string;
        spinDiameter: string;
        thickness: string;
        thicknessWithButton: string;
        width: string;
      };
      filter: {
        description: string;
        fadeName: string;
        moreOptions: string;
        productTypeAll: string;
      };
      help: {
        collectionDescriptionOverride: string;
        makerProductUrl: string;
        markdownDescription: string;
      };
      images: {
        aspectRatioGuideLink: string;
        aspectRatioWarning: string;
      };
      finishOptionCount: string;
      finishPreview: string;
      materialCount: string;
      noProducts: string;
      notImplemented: string;
      selectColorEffect: string;
      selectColors: string;
      selectFinishes: string;
      selectFinishOption: string;
      selectMaker: string;
      selectMaterial: string;
      selectMaterials: string;
      selectProductType: string;
    };
    collections: {
      add: {
        title: string;
      };
      cover: {
        clearConfirmation: string;
        current: string;
        deleteConfirmation: string;
        history: string;
      };
      directory: {
        avatar: string;
        itemCount: string;
        matchingItemCount: string;
      };
      duplicateWarning: string;
      edit: {
        noFields: string;
        title: string;
      };
      empty: string;
      emptyCollections: string;
      error: {
        chooseCollection: string;
        syncIncomplete: string;
        upload: string;
      };
      field: {
        collection: string;
        cover: string;
        description: string;
        displayName: string;
        name: string;
      };
      finishChoice: {
        custom: string;
        product: string;
      };
      placeholder: {
        description: string;
        name: string;
      };
      select: {
        addNew: string;
        placeholder: string;
      };
      visibility: {
        privateCallout: string;
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
    help: {
      comingSoon: string;
      contact: string;
      dateModified: string;
      datePublished: string;
      developmentCallout: string;
      topics: string;
    };
    navigation: {
      account: string;
      accountMenu: string;
      betaFeatures: string;
      collections: string;
      help: string;
      language: string;
      logOut: string;
      products: string;
      resources: string;
      selectLanguage: string;
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
      resources: {
        stub: string;
      };
    };
    resources: {
      action: {
        accept: string;
        add: string;
        closeImage: string;
        collapseVersion: string;
        collapseVersionHistory: string;
        delete: string;
        details: string;
        download: string;
        edit: string;
        expandVersion: string;
        expandVersionHistory: string;
        markPrivate: string;
        nextImage: string;
        permanentlyDelete: string;
        previousImage: string;
        removeFile: string;
        restore: string;
        retry: string;
        saveChanges: string;
        upload: string;
        uploadNewVersion: string;
      };
      add: {
        title: string;
      };
      category: {
        all: string;
        create: string;
        filterLabel: string;
        label: string;
        noResults: string;
        remove: string;
        search: string;
        select: string;
        selectedCount: string;
      };
      detail: {
        categories: string;
        currentVersion: string;
        downloadCount: string;
        fileSize: string;
        fileTypeFallback: string;
        filename: string;
        imageAlt: string;
        noImage: string;
        noPreview: string;
        notFound: string;
        openImage: string;
        previewAlt: string;
        sharedBy: string;
        totalDownloadCount: string;
        updatedOn: string;
        uploadedBy: string;
        uploadedOn: string;
        version: string;
        versionHistory: string;
        versionUploadedOn: string;
      };
      directory: {
        description: string;
        empty: string;
        emptyFiltered: string;
        filters: string;
        invalidFilter: string;
        loading: string;
        searchPlaceholder: string;
        title: string;
      };
      error: {
        deleteUnauthorized: string;
        downloadAccess: string;
        downloadUnavailable: string;
        editFailed: string;
        loadDetail: string;
        loadDirectory: string;
        loadManagement: string;
        permanentDeleteUnauthorized: string;
        previewAccess: string;
        previewUnavailable: string;
        resourceNotFound: string;
        restoreUnauthorized: string;
        saveFailed: string;
      };
      management: {
        description: string;
        editDescription: string;
        editResources: string;
        editTitle: string;
        empty: string;
        metadataOnly: string;
        title: string;
      };
      moderation: {
        confirmationDescription: string;
        confirmationTitle: string;
        failure: string;
        privateBadge: string;
        privateReason: string;
        privateSince: string;
        reasonLabel: string;
        reasonPlaceholder: string;
        reasonRequired: string;
        success: string;
      };
      notification: {
        acceptFailed: string;
        accepted: string;
        categories: string;
        categoryCreated: string;
        categoryName: string;
        createdAt: string;
        description: string;
        empty: string;
        read: string;
        resourceCreated: string;
        resourceName: string;
        title: string;
        unread: string;
        uploader: string;
      };
      trash: {
        adminEmpty: string;
        adminTitle: string;
        deletedBy: string;
        deletedOn: string;
        deletionRoleAdmin: string;
        deletionRoleOwner: string;
        description: string;
        ownerEmpty: string;
        ownerTitle: string;
        permanentConfirmationDescription: string;
        permanentConfirmationTitle: string;
        permanentFailure: string;
        permanentSuccess: string;
        restoreConfirmationDescription: string;
        restoreConfirmationTitle: string;
        restoreFailure: string;
        restoreSuccess: string;
        softDeleteConfirmationDescription: string;
        softDeleteConfirmationTitle: string;
        softDeleteFailure: string;
        softDeleteSuccess: string;
      };
      upload: {
        browseFiles: string;
        description: string;
        descriptionLabel: string;
        descriptionPlaceholder: string;
        expired: string;
        fileFailure: string;
        fileHelp: string;
        fileTypes: string;
        filesLabel: string;
        finalizationFailure: string;
        finalizing: string;
        imagesHelp: string;
        imagesLabel: string;
        imageTypes: string;
        nameLabel: string;
        namePlaceholder: string;
        newVersionTitle: string;
        previewHelp: string;
        previewLabel: string;
        previewTypes: string;
        progress: string;
        retryFile: string;
        sessionFailure: string;
        success: string;
        title: string;
        versionSuccess: string;
      };
      validation: {
        duplicateFilename: string;
        fileTooLarge: string;
        imageInvalidType: string;
        imageTooLarge: string;
        invalidFileType: string;
        previewInvalidType: string;
        previewTooLarge: string;
        requiredCategory: string;
        requiredDescription: string;
        requiredFile: string;
        requiredImage: string;
        requiredName: string;
        sessionTooLarge: string;
        tooManyFiles: string;
        tooManyImages: string;
        unsafeFilename: string;
      };
      visibility: {
        adminPrivateTooltip: string;
        private: string;
        public: string;
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
    storage: {
      sizeMiB: string;
    };
    upload: {
      finalizationFailure: string;
      saveFailed: string;
    };
  };
}>;

export type TranslationKey = DotPaths<CompleteLocalizationResource>;

export type Translations = Readonly<Record<TranslationKey, string>>;

export type LocalizationResource = DeepPartial<CompleteLocalizationResource>;
