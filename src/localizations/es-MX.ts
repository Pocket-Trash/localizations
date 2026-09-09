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
  web: {
    site: {
      name: "Pocket Trash",
    },
    action: {
      archive: "Archivar",
      clearAllFilters: "Borrar todos los filtros",
      close: "Cerrar",
      edit: "Editar",
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
