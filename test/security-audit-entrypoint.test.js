import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

function audit(t, report, status = 0) {
  const directory = mkdtempSync(path.join(tmpdir(), "audit-command-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  writeFileSync(
    path.join(directory, "pnpm"),
    `#!${process.execPath}\nprocess.stdout.write(process.env.AUDIT_REPORT); process.exit(Number(process.env.AUDIT_STATUS));\n`,
    { mode: 0o755 },
  );
  return spawnSync(process.execPath, ["scripts/security-audit.mjs"], {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: directory,
      AUDIT_REPORT: JSON.stringify(report),
      AUDIT_STATUS: String(status),
    },
  });
}

test("audit command rejects an advisories array", (t) => {
  assert.equal(audit(t, { advisories: [] }).status, 1);
});

for (const [name, report, status, expected] of [
  ["clean legacy report", { advisories: {} }, 0, 0],
  ["clean modern report", { vulnerabilities: {} }, 0, 0],
  [
    "moderate legacy findings",
    { advisories: { 1: { severity: "moderate" } } },
    1,
    0,
  ],
  [
    "moderate modern findings",
    { vulnerabilities: { pkg: { severity: "moderate" } } },
    1,
    0,
  ],
  [
    "high finding",
    {
      advisories: { 1: { severity: "high", github_advisory_id: "GHSA-test" } },
    },
    1,
    1,
  ],
  [
    "critical finding",
    { vulnerabilities: { pkg: { severity: "critical" } } },
    1,
    1,
  ],
  ["null report", null, 0, 1],
  ["missing data", {}, 0, 1],
  ["null container", { advisories: null }, 0, 1],
  ["string container", { advisories: "clean" }, 0, 1],
  ["modern array", { vulnerabilities: [] }, 0, 1],
  [
    "malformed optional container",
    { advisories: {}, vulnerabilities: [] },
    0,
    1,
  ],
  ["null advisory", { advisories: { 1: null } }, 0, 1],
  [
    "unknown severity",
    { vulnerabilities: { pkg: { severity: "unknown" } } },
    0,
    1,
  ],
  ["missing severity", { advisories: { 1: {} } }, 0, 1],
  ["failure with empty report", { advisories: {} }, 1, 1],
  ["network response", { error: "unavailable" }, 1, 1],
  ["failed process", { advisories: {} }, 2, 1],
]) {
  test(`audit command handles ${name}`, (t) => {
    const result = audit(t, report, status);
    assert.equal(result.status, expected, result.stderr);
  });
}

test("audit command blocks a missing executable", (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), "audit-missing-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, ["scripts/security-audit.mjs"], {
    encoding: "utf8",
    env: { ...process.env, PATH: directory },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /could not start/);
});
