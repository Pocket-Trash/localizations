# Contributing

Thanks for helping improve Pocket Trash localizations.

## Create or Update a Locale

Create and wire a new locale when the locale file does not exist yet:

```sh
pnpm localization:create nl-BE
```

Sync missing keys into existing non-English locale files:

```sh
pnpm localization:sync
```

## Edit Translations

Locale source files live in `src/localizations/` and use nested objects:

```ts
export const esMX = {
  action: {
    save: "Guardar",
  },
};
```

Callers use dot-separated keys such as `action.save`. The full required shape
lives in `CompleteLocalizationResource` in `src/types/localization.ts`.

`en-US` is the source of truth. Add new keys to
`src/types/localization.ts` and `src/localizations/en-US.ts`, then run:

```sh
pnpm localization:sync
```

Non-English files can leave values blank until the translation is ready. Blank
or missing values fall back to `en-US` at runtime.

## Open a Pull Request

1. Create a branch from `main`.
2. Make the translation or documentation change.
3. Run checks:

```sh
pnpm format
pnpm lint
pnpm test
```

4. Add a changeset:

```sh
pnpm changeset
```

5. Commit with a conventional commit message and no scope:

```sh
git add .
git commit -m "fix: update Spanish save label"
```

6. Push your branch and open a pull request.

Use a conventional commit message for the pull request title too, such as
`fix: update Spanish save label`.

## Dependency Security

Use Node 22.20.0 or newer within Node 22 and pnpm 11.27.1. Installs reject
external package releases younger than seven days, missing publication times,
and lockfiles that do not satisfy the current policy.

Run the all-scope high/critical audit before building or publishing:

```sh
pnpm security:audit
```

For an urgent security release, add only the reviewed exact package version to
`minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. Include a YAML comment with
the Linear issue, reason, and UTC maturity/removal time, then remove the entry
after it matures. Never lower `minimumReleaseAge` or add a scope wildcard.

There are no vulnerability exceptions. Do not add one without Roy's explicit
approval for the specific GHSA, an owner, a follow-up Linear issue, and a UTC
expiry within seven days. The first such exception also requires an expiry
validator so incomplete or expired entries fail every security gate.
