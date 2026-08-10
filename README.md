# field-log-localizations

Shared localization utilities and message catalogs for Field Log.

## Install

```sh
npm install field-log-localizations
```

## Use

```ts
import { formatMessage, resolveLocale } from 'field-log-localizations';

const locale = resolveLocale('es-MX');
const label = formatMessage('action.save', {}, locale);
```

## Develop

```sh
pnpm install
pnpm test
```

Publishing notes live in [docs/publishing.md](docs/publishing.md).
