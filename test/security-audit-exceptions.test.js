import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  auditException,
  evaluateAuditReport,
} from "../scripts/security-audit.mjs";

const bracesAdvisory = {
  findings: [
    {
      dev: true,
      paths: [".>@changesets/cli>@changesets/config>micromatch>braces"],
      version: "3.0.3",
    },
  ],
  github_advisory_id: "GHSA-vfj7-8cjw-p6xm",
  module_name: "braces",
  patched_versions: null,
  severity: "high",
};

describe("security audit exceptions", () => {
  it("allows only the reviewed dev-only Changesets advisory before expiry", () => {
    const result = evaluateAuditReport(
      { advisories: { 1240992: bracesAdvisory } },
      new Date("2026-10-07T00:00:00Z"),
    );

    assert.deepEqual(result, {
      blocking: [],
      ignored: [auditException.advisoryId],
    });
  });

  it("blocks the exception after its short expiry", () => {
    const result = evaluateAuditReport(
      { advisories: { 1240992: bracesAdvisory } },
      new Date("2026-10-14T00:00:00Z"),
    );

    assert.deepEqual(result, {
      blocking: [auditException.advisoryId],
      ignored: [],
    });
  });

  it("blocks runtime, unexpected-package, and unrelated high advisories", () => {
    const result = evaluateAuditReport(
      {
        advisories: {
          1: {
            ...bracesAdvisory,
            findings: [
              { dev: false, paths: [".>runtime>braces"], version: "3.0.3" },
            ],
          },
          2: {
            ...bracesAdvisory,
            module_name: "not-braces",
          },
          3: {
            findings: [{ dev: true, paths: [".>tool"], version: "1.0.0" }],
            github_advisory_id: "GHSA-aaaa-bbbb-cccc",
            module_name: "other",
            patched_versions: ">=1.0.1",
            severity: "critical",
          },
        },
      },
      new Date("2026-10-07T00:00:00Z"),
    );

    assert.deepEqual(result, {
      blocking: [
        auditException.advisoryId,
        auditException.advisoryId,
        "GHSA-aaaa-bbbb-cccc",
      ],
      ignored: [],
    });
  });
});
