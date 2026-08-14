import assert from "node:assert/strict";
import test from "node:test";

import { stampChangelogReleaseDate } from "../scripts/stamp-changelog-release-date.mjs";

test("adds the publish date below the version heading", () => {
  assert.equal(
    stampChangelogReleaseDate(
      "# Package\n\n## 1.2.3\n\n### Patch Changes\n\n- Fix copy.\n",
      "1.2.3",
      "2026-08-14",
    ),
    "# Package\n\n## 1.2.3\n\n_Published 2026-08-14._\n\n### Patch Changes\n\n- Fix copy.\n",
  );
});

test("does not add a second publish date", () => {
  const changelog =
    "# Package\n\n## 1.2.3\n\n_Published 2026-08-14._\n\n### Patch Changes\n\n- Fix copy.\n";

  assert.equal(
    stampChangelogReleaseDate(changelog, "1.2.3", "2026-08-15"),
    changelog,
  );
});

test("fails when the version heading is missing", () => {
  assert.throws(
    () => stampChangelogReleaseDate("# Package\n", "1.2.3", "2026-08-14"),
    /Could not find ## 1\.2\.3/,
  );
});
