import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_LOCALE,
  assertCompleteCatalogs,
  clerkLocalizations,
  formatMessage,
  getClerkLocalization,
  getMessages,
  messageKeys,
  messages,
  resolveLocale,
} from '../dist/index.js';

test('resolves locale preferences with English fallback', () => {
  assert.equal(resolveLocale('fr-CA', 'es-MX'), 'es-MX');
  assert.equal(resolveLocale(['fr-CA', 'en-US']), 'en');
  assert.equal(resolveLocale(null, undefined, 'zz'), DEFAULT_LOCALE);
});

test('orders Accept-Language values by q weight', () => {
  assert.equal(resolveLocale('fr-CA, es-MX;q=0.9, en-US;q=0.8'), 'es-MX');
  assert.equal(resolveLocale('fr-CA;q=0.9, en-US;q=0.8, es-MX;q=0.7'), 'en');
});

test('interpolates message placeholders', () => {
  assert.equal(formatMessage('app.name'), 'Pocket Trash');
  assert.equal(formatMessage('locale.current', { locale: 'es-MX' }, 'es'), 'Idioma actual: es-MX');
  assert.equal(formatMessage('locale.current', {}, 'en'), 'Current language: {locale}');
});

test('falls back to English messages for unsupported locales', () => {
  assert.equal(getMessages('fr-CA'), messages.en);
});

test('catalogs expose the same stable keys', () => {
  assert.equal(assertCompleteCatalogs(), true);
  assert.deepEqual(Object.keys(messages['es-MX']).sort(), [...messageKeys].sort());
});

test('maps supported locales to Clerk localizations without copying English strings', () => {
  assert.deepEqual(Object.keys(clerkLocalizations).sort(), ['en', 'es-MX']);
  assert.equal(getClerkLocalization('en'), undefined);
  assert.equal(getClerkLocalization('es-MX'), clerkLocalizations['es-MX']);
  assert.equal(getClerkLocalization('fr-CA'), undefined);
});
