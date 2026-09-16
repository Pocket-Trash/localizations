import type { LocalizationResource } from "../types/localization.js";

/**
 * es-MX translations for Pocket Trash.
 *
 * This catalog is checked against `LocalizationResource` from
 * `src/types/localization.ts`. When adding a translation key, update that type
 * first, add the required English string in `src/localizations/en-US.ts`, then
 * run `pnpm localization:sync` so this locale gets any missing blank fields.
 * Blank strings fall back to `en-US` at runtime until translated.
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
  web: {
    site: {
      name: "Pocket Trash",
    },
    action: {
      addColor: "Agregar color",
      addFinish: "Agregar acabado",
      addFinishOption: "Agregar opción de acabado",
      addMaker: "Add maker",
      addMaterial: "Add material",
      addProduct: "Add product",
      addToCollection: "Add to collection",
      archive: "Archivar",
      clearAllFilters: "Borrar todos los filtros",
      close: "Cerrar",
      confirmAdd: "Add another",
      edit: "Editar",
      moveFinishOptionDown: "Mover la opción de acabado hacia abajo",
      moveFinishOptionUp: "Mover la opción de acabado hacia arriba",
      removeFinishOption: "Quitar opción de acabado",
      removeSelection: "Quitar {name}",
      saveFlag: "Guardar bandera",
      search: "Buscar",
      signIn: "Iniciar sesion",
      visitProductPage: "Visitar pagina del producto",
    },
    admin: {
      featureFlags: {
        actions: "Acciones",
        adminOnlyTargeting: "Segmentacion solo para admins",
        audience: "Audiencia",
        booleanControls:
          "Controles booleanos para superficies globales, privadas y beta.",
        description: "Descripcion",
        displayName: "Nombre visible",
        editFlag: "Editar bandera",
        emailUsernameOrName: "Email, usuario o nombre",
        featureFlags: "Banderas de funciones",
        flag: "Bandera",
        flags: "Banderas",
        globalDefaultEnabled: "Valor global activado",
        newFlag: "Nueva bandera",
        searchUsers: "Buscar usuarios",
        slugPlaceholder: "new-library-ui",
      },
    },
    archive: {
      closeSearch: "Cerrar busqueda",
      controls: "Controles del archivo",
      defaultPenDescription: "{siteName} pen.",
      filterDescription:
        "Filtra el archivo por categoria, tamano, material y mas.",
      filters: "Filtros",
      itemCount: "{visible} of {total} items",
      noDescription: "(no description on file)",
      noItems: "Ningun articulo coincide con estos filtros.",
      searchPlaceholder: "Buscar...",
      searchProducts:
        "Buscar plumas por titulo, especificaciones o descripcion",
      sortLabel: "Ordenar",
      sortProducts: "Ordenar plumas",
      sortDescription: "Elige como ordenar el archivo.",
      footer: {
        fanMade: "Hecho por un fan; sin afiliacion con ningun fabricante.",
        productOwnership:
          "Los nombres, imagenes y descripciones de productos siguen siendo propiedad de sus respectivos duenos.",
        resourceFor: "Un recurso para",
        suggestionsOrContact: "Sugerencias o contacto:",
        discord: "y el Discord de Machined Pens.",
      },
      headline: {
        grip: "{size} Grip",
        mechanism: "{size} Mechanism",
        pen: "Pen",
      },
      lightbox: {
        archived: "Archivada - ya no esta listada",
        closeProductDetails: "Cerrar detalles del producto",
        nextImage: "Siguiente imagen",
        previousImage: "Imagen anterior",
        released: "Publicado",
        specsDescription:
          "Especificaciones, materiales y detalles de lanzamiento de este producto.",
      },
      filter: {
        all: "todos",
        any: "cualquiera",
        matchMode: "Modo de coincidencia de {label}",
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
        newestDrop: "Lanzamiento mas reciente",
        oldestDrop: "Lanzamiento mas antiguo",
        priceLowToHigh: "Precio de menor a mayor",
        priceHighToLow: "Precio de mayor a menor",
        weightLightToHeavy: "Peso de menor a mayor",
        weightHeavyToLight: "Peso de mayor a menor",
        diameterThinToThick: "Diametro de delgado a grueso",
        diameterThickToThin: "Diametro de grueso a delgado",
        titleAToZ: "Titulo A a Z",
      },
      spec: {
        diameter: "Diametro",
        length: "Longitud",
        model: "Modelo",
        price: "Precio",
        weight: "Peso",
      },
      state: {
        archived: "Archivada",
      },
    },
    catalog: {
      colorEffect: {
        fade: "Degradado",
        solid: "Sólido",
      },
      defaultButton: "Default Button",
      error: {
        colorEffectRequired: "Selecciona un efecto de color.",
        colorEffectWithoutColors: "Agrega un color o quita el efecto de color.",
        duplicate: "That name already exists.",
        duplicateComponent:
          "Cada acabado o color solo puede seleccionarse una vez.",
        duplicateFinishOption: "Esa opción de acabado ya está en la lista.",
        fadeColors: "Selecciona al menos dos colores para un degradado.",
        finishOptionRequired: "Agrega al menos una opción de acabado.",
        finishRequired: "Selecciona al menos un acabado.",
        form: "We couldn't save this. Check the fields and try again.",
        positive: "Enter a number greater than zero.",
        productFinishRequired:
          "Selecciona un acabado del producto o crea un acabado personalizado.",
        productMaterialRequired:
          "Selecciona un material ofrecido por este producto.",
        required: "This field is required.",
        url: "Enter a valid URL.",
      },
      field: {
        button: "Button",
        buttonDiameter: "Button diameter",
        colorEffect: "Efecto de color",
        colors: "Colores",
        finishes: "Acabados",
        finishOptions: "Opciones de acabado",
        maker: "Maker",
        materials: "Materials",
        name: "Name",
        productType: "Product type",
        rootUrl: "Maker URL",
        slug: "Slug",
        thickness: "Thickness",
        thicknessWithButton: "Thickness with button",
        width: "Width",
      },
      finishOptionCount: "Opciones de acabado: {count}",
      finishPreview: "Vista previa: {finish}",
      materialCount: "Materiales: {count}",
      noProducts: "No products yet.",
      notImplemented: "This product type is not implemented yet.",
      selectColorEffect: "Selecciona un efecto de color",
      selectColors: "Selecciona colores",
      selectFinishes: "Selecciona acabados",
      selectFinishOption: "Selecciona una opción de acabado",
      selectMaker: "Select a maker",
      selectMaterial: "Selecciona un material",
      selectMaterials: "Select materials",
      selectProductType: "Select a product type",
    },
    collections: {
      directory: {
        avatar: "Generic collector avatar",
        itemCount: "Collection items: {count}",
      },
      duplicateWarning:
        "Matching products already owned: {count}. Confirm to add another.",
      edit: {
        noFields:
          "There are no collection-specific fields to edit for this item.",
      },
      empty: "No collection items yet.",
      finishChoice: {
        custom: "Acabado personalizado",
        product: "Acabado del producto",
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
      account: "Cuenta",
      accountMenu: "Menu de cuenta",
      betaFeatures: "Funciones beta",
      collections: "Colecciones",
      language: "Idioma",
      logOut: "Cerrar sesion",
      products: "Products",
      resources: "Resources",
      selectLanguage: "Seleccionar idioma",
      user: "Usuario",
    },
    locale: {
      enUS: "English (US)",
      esMX: "Spanish (Mexico)",
    },
    page: {
      betaFeatures: {
        empty: "No hay funciones beta disponibles.",
      },
      collections: {
        empty: "Las colecciones estaran disponibles mas adelante.",
      },
      notFound: {
        description: "Esta pagina no existe o ya no esta disponible.",
        returnToArchive: "Volver al archivo",
        title: "No encontrado",
        unavailable: "Pagina no disponible",
      },
      resources: {
        stub: "Resources are coming soon.",
      },
    },
    settings: {
      about: "About",
      aboutDescription:
        "An unofficial archive of machined pen drops, with filters, specs, descriptions, and local image backups. Made by a fan; not affiliated with any maker.",
      currency: "Moneda",
      dark: "Oscuro",
      dimensionUnits: "Unidades de dimensiones",
      dimensions: "Dimensiones",
      displayCurrency: "Moneda de visualizacion",
      displayPreferences: "Preferencias de visualizacion para el archivo.",
      displayPreferencesMachinedPens:
        "Preferencias de visualizacion para el archivo de plumas maquinadas.",
      grams: "Gramos",
      inches: "Pulgadas",
      language: "Idioma",
      light: "Claro",
      millimeters: "Milimetros",
      settings: "Ajustes",
      system: "Sistema",
      theme: "Tema",
      weight: "Peso",
      weightUnits: "Unidades de peso",
      ounces: "Onzas",
    },
    sidebar: {
      close: "Cerrar barra lateral",
      description: "Muestra la barra lateral movil.",
      sidebar: "Barra lateral",
      toggle: "Alternar barra lateral",
    },
    status: {
      disabled: "Desactivada",
      enabled: "Activada",
      failedToLoad: "No se pudo cargar.",
    },
  },
} satisfies LocalizationResource;
