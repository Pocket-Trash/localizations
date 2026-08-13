# @pocket-trash/localizations

Shared localization utilities and message catalogs for Pocket Trash.

## Install

```sh
npm install @pocket-trash/localizations
```

## Use

```ts
import { formatMessage, resolveLocale } from '@pocket-trash/localizations';

const locale = resolveLocale('es-MX');
const label = formatMessage('action.save', {}, locale);
```

## Develop

```sh
pnpm install
pnpm test
```

Publishing notes live in [docs/publishing.md](docs/publishing.md).
