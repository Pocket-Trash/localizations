import assert from 'node:assert/strict';
import test from 'node:test';

import { checkChangesets } from '../scripts/check-pr-changesets.mjs';

test('fails when there is no changeset', () => {
  assert.deepEqual(checkChangesets([{ filename: 'src/index.ts', content: '' }]), {
    hasRelease: false,
    major: false,
  });
});

test('fails for empty changesets', () => {
  assert.deepEqual(checkChangesets([{ filename: '.changeset/empty.md', content: '---\n---\nNo release.' }]), {
    hasRelease: false,
    major: false,
  });
});

test('passes for patch and minor changesets', () => {
  assert.deepEqual(
    checkChangesets([
      { filename: '.changeset/fix.md', content: '---\nfield-log-localizations: patch\n---\nFix copy.' },
      { filename: '.changeset/add.md', content: '---\n"field-log-localizations": minor\n---\nAdd copy.' },
    ]),
    {
      hasRelease: true,
      major: false,
    },
  );
});

test('detects major changesets', () => {
  assert.deepEqual(
    checkChangesets([{ filename: '.changeset/break.md', content: '---\nfield-log-localizations: major\n---\nBreak API.' }]),
    {
      hasRelease: true,
      major: true,
    },
  );
});
