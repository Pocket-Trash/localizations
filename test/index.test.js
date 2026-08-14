import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createLocalization, syncLocalizations } from '../scripts/localizations.mjs';
import {
  DEFAULT_LOCALE,
  assertCompleteCatalogs,
  clerkLocalizations,
  enUS,
  esMX,
  formatTranslation,
  formatMessage,
  getClerkLocalization,
  getMessages,
  getTranslations,
  localizations,
  messageKeys,
  messages,
  resolveLocale,
  translationKeys,
  translations,
} from '../dist/index.js';

test('resolves locale preferences with en-US fallback', () => {
  assert.equal(resolveLocale('fr-CA', 'es-MX'), 'es-MX');
  assert.equal(resolveLocale(['fr-CA', 'en-US']), 'en-US');
  assert.equal(resolveLocale(null, undefined, 'zz'), DEFAULT_LOCALE);
});

test('orders Accept-Language values by q weight', () => {
  assert.equal(resolveLocale('fr-CA, es-MX;q=0.9, en-US;q=0.8'), 'es-MX');
  assert.equal(resolveLocale('fr-CA;q=0.9, en-US;q=0.8, es-MX;q=0.7'), 'en-US');
});

test('does not treat bare en as a supported locale alias', () => {
  assert.equal(resolveLocale('en', 'es-MX'), 'es-MX');
  assert.equal(resolveLocale('en'), DEFAULT_LOCALE);
});

test('interpolates translation placeholders', () => {
  assert.equal(formatTranslation('app.name'), 'Pocket Trash');
  assert.equal(formatTranslation('locale.current', { locale: 'es-MX' }, 'es-MX'), 'Idioma actual: es-MX');
  assert.equal(formatTranslation('locale.current', {}, 'en-US'), 'Current language: {locale}');
});

test('keeps message helpers as compatibility aliases', () => {
  assert.equal(getMessages, getTranslations);
  assert.equal(formatMessage, formatTranslation);
  assert.equal(messages, translations);
  assert.equal(messageKeys, translationKeys);
});

test('falls back to en-US translations for unsupported locales', () => {
  assert.equal(getTranslations(resolveLocale('fr-CA')), translations['en-US']);
});

test('catalogs use nested sources and flat public translations', () => {
  assert.equal(assertCompleteCatalogs(), true);
  assert.equal(localizations['en-US'], enUS);
  assert.equal(localizations['es-MX'], esMX);
  assert.equal(localizations['es-MX'].action?.save, 'Guardar');
  assert.equal(translations['es-MX']['action.save'], 'Guardar');
  assert.deepEqual(Object.keys(translations['es-MX']).sort(), [...translationKeys].sort());
  assert.deepEqual([...translationKeys].sort(), [
    'action.cancel',
    'action.save',
    'app.name',
    'error.generic',
    'locale.current',
  ]);
});

test('maps supported locales to Clerk localizations without copying English strings', () => {
  assert.deepEqual(Object.keys(clerkLocalizations).sort(), ['en-US', 'es-MX']);
  assert.equal(getClerkLocalization('en-US'), undefined);
  assert.equal(getClerkLocalization('es-MX'), clerkLocalizations['es-MX']);
  assert.equal(getClerkLocalization(resolveLocale('fr-CA')), undefined);
});

test('scaffolds and syncs locale files from en-US', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'pocket-trash-localizations-'));
  fs.mkdirSync(path.join(fixture, 'src/localizations'), { recursive: true });
  fs.cpSync('src/localizations/en-US.ts', path.join(fixture, 'src/localizations/en-US.ts'));
  fs.cpSync('src/localizations/es-MX.ts', path.join(fixture, 'src/localizations/es-MX.ts'));
  fs.cpSync('src/index.ts', path.join(fixture, 'src/index.ts'));

  createLocalization('nl-BE', { cwd: fixture });

  const nlBEPath = path.join(fixture, 'src/localizations/nl-BE.ts');
  const scaffold = fs.readFileSync(nlBEPath, 'utf8');
  const wiredIndex = fs.readFileSync(path.join(fixture, 'src/index.ts'), 'utf8');

  assert.match(scaffold, /export const nlBE =/);
  assert.match(scaffold, /save: '',/);
  assert.match(wiredIndex, /'nl-BE'/);
  assert.match(wiredIndex, /import \{ nlBE \} from '\.\/localizations\/nl-BE\.js';/);

  const enUSPath = path.join(fixture, 'src/localizations/en-US.ts');
  fs.writeFileSync(
    enUSPath,
    fs
      .readFileSync(enUSPath, 'utf8')
      .replace(
        /  action: \{/,
        `  buttons: {
    action: {
      save: 'Save action',
    },
  },
  action: {`,
      ),
  );

  syncLocalizations({ cwd: fixture });

  assert.match(fs.readFileSync(nlBEPath, 'utf8'), /buttons: \{\n    action: \{\n      save: '',/);
});
