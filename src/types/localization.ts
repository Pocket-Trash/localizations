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
    changelog: {
      allCategories: string;
      copyFailed: string;
      copyLink: string;
      dateModified: string;
      datePublished: string;
      empty: string;
      emptyCategory: string;
      linkCopied: string;
      nextPage: string;
      pageStatus: string;
      previousPage: string;
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
      clearSearch: string;
      close: string;
      confirmAdd: string;
      deleteCover: string;
      deleteImage: string;
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
      signOut: string;
      uploadImages: string;
      view: string;
      viewCollection: string;
      viewItem: string;
      viewProductDetails: string;
      visitProductPage: string;
    };
    admin: {
      audit: {
        action: string;
        actor: string;
        actorId: string;
        after: string;
        before: string;
        coverage: string;
        coveredDomains: string;
        deleteAction: string;
        deleteConfirmation: string;
        deletedUser: string;
        description: string;
        exportAction: string;
        exportDescription: string;
        exportReasonPlaceholder: string;
        exportSummary: string;
        exportTitle: string;
        fromDate: string;
        metadata: string;
        noEvents: string;
        noValue: string;
        occurred: string;
        olderEvents: string;
        owner: string;
        reason: string;
        target: string;
        targetId: string;
        targetType: string;
        title: string;
        toDate: string;
      };
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
      makers: {
        description: string;
        editMaker: string;
        empty: string;
        imageAction: string;
        imagesEmpty: string;
        rootUrl: string;
        title: string;
      };
      users: {
        active: string;
        ban: string;
        banned: string;
        description: string;
        noResults: string;
        pendingBan: string;
        pendingUnban: string;
        reasonPlaceholder: string;
        title: string;
        unban: string;
        updated: string;
        updateReason: string;
      };
      hub: {
        catalogImageTrash: string;
        description: string;
        materials: string;
        title: string;
      };
      notifications: {
        title: string;
      };
      settings: {
        title: string;
        linear: {
          title: string;
          description: string;
          connect: string;
          connectedAs: string;
          update: string;
          remove: string;
          needsUpdate: string;
          actionFailed: string;
        };
      };
      trash: {
        title: string;
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
      approval: {
        approve: string;
        collectionItem: {
          approve: string;
          reject: string;
          title: string;
        };
        reasonLabel: string;
        reasonPlaceholder: string;
        reject: string;
        reverse: string;
        status: {
          approved: string;
          pending: string;
          rejected: string;
        };
        title: string;
      };
      collectionsWithProduct: string;
      colorEffect: {
        fade: string;
        solid: string;
      };
      defaultButton: string;
      deletion: {
        action: string;
        blocked: string;
        confirmation: string;
        description: string;
        failed: string;
        title: string;
      };
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
    slider: {
      productType: {
        slider: string;
        plate: string;
        insert: string;
        spinner: string;
        spinnerButton: string;
      };
      alias: {
        add: string;
        canonicalLabel: string;
        managementLabel: string;
        matchedContext: string;
        preferred: string;
        preferredMakerLabel: string;
      };
      capability: {
        label: string;
        bodyHosted: string;
        insertDriven: string;
        notRecorded: string;
      };
      measurement: {
        basis: string;
        bodyOnly: string;
        completeBuild: string;
        setLevel: string;
        setLevelHelp: string;
        weightBasis: string;
      };
      appearance: {
        label: string;
        materialRequired: string;
        optional: string;
        none: string;
        pattern: string;
        patterns: string;
        selectPattern: string;
      };
      setup: {
        title: string;
        default: string;
        defaultDescription: string;
        advertisedDefault: string;
        availableOffers: string;
        offer: string;
        selectOffer: string;
        custom: string;
        fromScratch: string;
        liveCatalog: string;
        sourceNote: string;
        incompleteSourceNote: string;
        clickCount: string;
        clicks: string;
        clearClickCount: string;
        clickCountCleared: string;
        notRecorded: string;
      };
      magnet: {
        configuration: string;
        configurations: string;
        vocabularyLabel: string;
        halfA: string;
        halfB: string;
        slot: string;
        slots: string;
        group: string;
        groups: string;
        size: string;
        grade: string;
        row: string;
        column: string;
        insertionPosition: string;
        state: {
          occupied: string;
          empty: string;
          unknown: string;
        };
      };
      relationship: {
        plates: string;
        includedPlates: string;
        addPlates: string;
        includedComponents: string;
        included: string;
        installed: string;
        availableInsertOffers: string;
        inclusionHelp: string;
      };
      component: {
        plateSet: string;
        insertSet: string;
        spare: string;
        installedPlate: string;
        installedInsert: string;
        noPlate: string;
        noInsert: string;
        createIncluded: string;
        linkExisting: string;
        install: string;
        uninstall: string;
        replace: string;
        detach: string;
        moveAssembly: string;
        moveAssemblySummary: string;
        uninstallBeforeTransfer: string;
        deleteSliderKeepsComponents: string;
        deleteComponentDetaches: string;
      };
      search: {
        label: string;
        placeholder: string;
        matchedAliasContext: string;
        matchedTypeContext: string;
        ownerMatchContext: string;
        noResults: string;
      };
      filter: {
        description: string;
        pattern: string;
        plate: string;
        spinnerButton: string;
        any: string;
        all: string;
        resultsAnnouncement: string;
      };
      privacy: {
        inherited: string;
        inheritedDescription: string;
        inheritedHelp: string;
        savedPreference: string;
        staffForcedPrivate: string;
        blockingComponent: string;
      };
      moderation: {
        blockedTitle: string;
        publicBlocked: string;
        installBlocked: string;
        unavailableComponent: string;
      };
      validation: {
        capabilityRequired: string;
        bodyHostedInsert: string;
        alreadyInstalled: string;
        differentOwner: string;
        unapproved: string;
        exactProduct: string;
        onePlate: string;
        oneInsert: string;
        clickOption: string;
        completeConfiguration: string;
        unknownSlot: string;
        incompleteSlot: string;
        overlappingGroup: string;
        positiveDimension: string;
        crossConfiguration: string;
        advertisedDefault: string;
      };
      confirmation: {
        createIncluded: string;
        linkIncluded: string;
        install: string;
        uninstall: string;
        replace: string;
        moveAssembly: string;
        deleteStandalone: string;
        deleteInstalledComponent: string;
        deleteSlider: string;
      };
      empty: {
        noOffers: string;
        noSearchResults: string;
        noFilterResults: string;
      };
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
      deletion: {
        deleteConfirmation: string;
        deleteChoice: string;
        destination: string;
        itemAction: string;
        itemConfirmation: string;
        itemDescription: string;
        moveAction: string;
        moveChoice: string;
        moveConfirmation: string;
        moveSummary: string;
        noDestination: string;
        open: string;
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
      gallery: {
        deleteConfirmation: string;
        imagesHelp: string;
        nextPage: string;
        owner: string;
        pageStatus: string;
        previousPage: string;
        title: string;
      };
      field: {
        collection: string;
        cover: string;
        description: string;
        displayName: string;
        name: string;
        summary: string;
      };
      finishChoice: {
        custom: string;
        product: string;
      };
      placeholder: {
        description: string;
        name: string;
        summary: string;
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
    erasure: {
      self: {
        title: string;
        description: string;
        open: string;
        dialogTitle: string;
        dialogIntro: string;
        deletedData: string;
        productsRemain: string;
        retention: string;
        publicCopies: string;
        confirm: string;
        submit: string;
        failure: string;
      };
      status: {
        title: string;
        processing: string;
        processingDescription: string;
        needsSupport: string;
        needsSupportDescription: string;
        completed: string;
        completedDescription: string;
        requestId: string;
        support: string;
      };
      admin: {
        navigation: string;
        title: string;
        description: string;
        emailLabel: string;
        emailPlaceholder: string;
        findTarget: string;
        findingTarget: string;
        targetNotFound: string;
        targetLabel: string;
        verificationMethodLabel: string;
        authenticatedRequest: string;
        verifiedEmail: string;
        referenceLabel: string;
        referenceDescription: string;
        start: string;
        starting: string;
        requestTitle: string;
        statusLabel: string;
        errorLabel: string;
        retry: string;
        retrying: string;
        failure: string;
      };
      productNotice: string;
    };
    feedback: {
      title: string;
      board: {
        empty: string;
        error: string;
        loading: string;
        searchLabel: string;
        searchPlaceholder: string;
      };
      details: {
        open: string;
        title: string;
      };
      duplicates: {
        description: string;
        submitAnyway: string;
        title: string;
        upvote: string;
      };
      new: {
        title: string;
        description: string;
        titleLabel: string;
        titleHelp: string;
        descriptionHelp: string;
        categoryLabel: string;
        categoryPlaceholder: string;
        submit: string;
        submitting: string;
        success: string;
        failure: string;
        limit: string;
      };
      myRequests: {
        title: string;
        empty: string;
        error: string;
        loading: string;
        nextPage: string;
        noResults: string;
        previousPage: string;
        searchLabel: string;
        searchPlaceholder: string;
      };
      admin: {
        navigation: {
          allActive: string;
          active: string;
          archive: string;
          requests: string;
        };
        plan: {
          action: string;
          title: string;
          typeLabel: string;
          issue: string;
          project: string;
          assignIssue: string;
          leadProject: string;
          labels: string;
          submit: string;
          loading: string;
          success: string;
          failure: string;
          connectionRequired: string;
          settingsLink: string;
        };
        sync: {
          action: string;
          connectionRequired: string;
          failure: string;
          success: string;
        };
        table: {
          actions: string;
          category: string;
          status: string;
          submitted: string;
          submitter: string;
          title: string;
          updated: string;
          votes: string;
        };
        sort: {
          ascending: string;
          descending: string;
          remove: string;
        };
        requests: {
          title: string;
          empty: string;
          error: string;
          loading: string;
          approve: string;
          saveAndApprove: string;
          deny: string;
          categoryRequired: string;
          approved: string;
          denied: string;
          detailsOpen: string;
          detailsTitle: string;
          merge: string;
          mergeTargetLabel: string;
          mergeTargetPlaceholder: string;
          merged: string;
          planRecoveryRequired: string;
          updated: string;
          actionFailed: string;
          previousPage: string;
          nextPage: string;
        };
        active: {
          empty: string;
          error: string;
          loading: string;
          nextPage: string;
          previousPage: string;
          searchLabel: string;
          searchPlaceholder: string;
          title: string;
        };
        archive: {
          allStatuses: string;
          empty: string;
          error: string;
          loading: string;
          nextPage: string;
          noResults: string;
          previousPage: string;
          searchLabel: string;
          searchPlaceholder: string;
          statusLabel: string;
          title: string;
        };
      };
      status: {
        canceled: string;
        completed: string;
        denied: string;
        inProgress: string;
        merged: string;
        pending: string;
        planned: string;
        requested: string;
      };
      vote: {
        add: string;
        failure: string;
        permanent: string;
        remove: string;
      };
      category: {
        productType: string;
        feature: string;
        improvement: string;
        bug: string;
        unset: string;
      };
      metadata: {
        submittedOn: string;
        submittedBy: string;
        votes: string;
      };
      notification: {
        completed: string;
        description: string;
        empty: string;
        submitted: string;
        title: string;
      };
    };
    footer: {
      discordNewTab: string;
      tagline: string;
      xNewTab: string;
    };
    help: {
      comingSoon: string;
      contact: string;
      dateModified: string;
      datePublished: string;
      developmentCallout: string;
      topics: string;
    };
    markdownEditor: {
      mode: {
        visual: string;
        source: string;
      };
      toolbar: {
        heading1: string;
        heading2: string;
        heading3: string;
        bold: string;
        italic: string;
        strikethrough: string;
        link: string;
        unorderedList: string;
        orderedList: string;
        table: string;
        horizontalRule: string;
        blockquote: string;
      };
      link: {
        text: string;
        url: string;
        insert: string;
        update: string;
        remove: string;
        invalidUrl: string;
      };
      status: {
        loading: string;
        fallback: string;
      };
      count: {
        characters: {
          normal: string;
          warning: string;
          limitReached: string;
          overLimit: string;
        };
        words: {
          normal: string;
          warning: string;
          limitReached: string;
          overLimit: string;
        };
      };
    };
    materials: {
      admin: {
        addTitle: string;
        created: string;
        description: string;
        editTitle: string;
        empty: string;
        saved: string;
        slugHelp: string;
        title: string;
      };
      count: {
        collectionItems: string;
        products: string;
      };
      detail: {
        collectionItems: string;
        collectionItemsPagination: string;
        noCollectionItems: string;
        noProducts: string;
        products: string;
        productsPagination: string;
      };
      directory: {
        description: string;
        empty: string;
        other: string;
        popular: string;
        tableOfContents: string;
        title: string;
      };
      image: {
        alt: string;
        archiveConfirmation: string;
        empty: string;
        placeholder: string;
        restore: string;
        restoreConfirmation: string;
        uploadFailed: string;
        uploadHelp: string;
      };
      validation: {
        duplicateImage: string;
      };
    };
    makers: {
      collectionItems: string;
      collectionItemsPagination: string;
      collectionItemCount: string;
      detailDescription: string;
      directoryDescription: string;
      empty: string;
      imageAlt: string;
      imageCount: string;
      noCollectionItems: string;
      noProducts: string;
      other: string;
      popular: string;
      products: string;
      productsPagination: string;
      productCount: string;
      productMakerAttribution: string;
      tableOfContents: string;
      visitWebsite: string;
    };
    navigation: {
      account: string;
      accountMenu: string;
      admin: string;
      betaFeatures: string;
      changelog: string;
      collections: string;
      contact: string;
      help: string;
      home: string;
      language: string;
      logOut: string;
      materials: string;
      makers: string;
      privacy: string;
      products: string;
      resources: string;
      selectLanguage: string;
      termsOfService: string;
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
      error: {
        copied: string;
        copyDetails: string;
        copyFailed: string;
        description: string;
        retry: string;
        retrying: string;
        returnHome: string;
        technicalDetails: string;
        title: string;
      };
      notFound: {
        description: string;
        returnHome: string;
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
        archiveDownloadFallback: string;
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
      adminMenu: string;
      close: string;
      description: string;
      profile: string;
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
