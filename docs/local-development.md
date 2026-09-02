# Local Development

Use this when another app depends on `@pocket-trash/localizations` and you want
changes here to show up without publishing a package.

## Watch This Package

```sh
pnpm install
pnpm dev
```

`pnpm dev` runs:

```sh
tsc -p tsconfig.json --watch
```

That is the same build path as `pnpm build`, with TypeScript watch mode added.

## Link From Another App

In the consuming app:

```sh
pnpm link /path/to/field-log-localizations
```

Keep `pnpm dev` running in this package. The app will resolve
`@pocket-trash/localizations` from this checkout, and this package will rebuild
`dist/` whenever source files change.

If the consuming app does not notice dependency changes inside `node_modules`,
restart its dev server after this package rebuilds.

## Alternative

If symlinks cause trouble in the consuming app, use a `file:` dependency
temporarily:

```sh
pnpm add @pocket-trash/localizations@file:/path/to/localizations
```

Switch back to the published package before merging app changes.
