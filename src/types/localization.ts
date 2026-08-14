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
}>;

export type TranslationKey = DotPaths<CompleteLocalizationResource>;

export type Translations = Readonly<Record<TranslationKey, string>>;

export type LocalizationResource = DeepPartial<CompleteLocalizationResource>;
