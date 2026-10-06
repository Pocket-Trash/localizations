import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const auditException = Object.freeze({
  advisoryId: "GHSA-vfj7-8cjw-p6xm",
  expiresAt: "2026-10-13T23:59:59Z",
  issue: "ENG-366",
  owner: "Pocket Trash Engineering",
  packageName: "braces",
  rationale:
    "The advisory has no patched release and is reachable only through the dev-only Changesets CLI with repository-controlled glob patterns.",
  reviewedAt: "2026-10-06T00:00:00Z",
  usageBoundary: ".>@changesets/cli>",
});

const blockingSeverities = new Set(["critical", "high"]);

function isReviewedException(advisory, now) {
  if (now.getTime() > new Date(auditException.expiresAt).getTime())
    return false;
  if (
    advisory.github_advisory_id !== auditException.advisoryId ||
    advisory.module_name !== auditException.packageName ||
    advisory.patched_versions !== null ||
    advisory.severity !== "high" ||
    !Array.isArray(advisory.findings) ||
    advisory.findings.length === 0
  )
    return false;

  return advisory.findings.every(
    (finding) =>
      finding?.dev === true &&
      finding.version === "3.0.3" &&
      Array.isArray(finding.paths) &&
      finding.paths.length > 0 &&
      finding.paths.every(
        (path) =>
          typeof path === "string" &&
          path.startsWith(auditException.usageBoundary),
      ),
  );
}

export function evaluateAuditReport(report, now = new Date()) {
  const advisories =
    report && typeof report === "object" && report.advisories
      ? Object.values(report.advisories)
      : [];
  const blocking = [];
  const ignored = [];

  for (const advisory of advisories) {
    if (
      !advisory ||
      typeof advisory !== "object" ||
      !blockingSeverities.has(advisory.severity)
    )
      continue;
    const id = advisory.github_advisory_id;
    if (typeof id !== "string") {
      blocking.push("unknown-high-or-critical-advisory");
      continue;
    }
    if (isReviewedException(advisory, now)) ignored.push(id);
    else blocking.push(id);
  }

  const vulnerabilities =
    report && typeof report === "object" && report.vulnerabilities
      ? Object.values(report.vulnerabilities)
      : [];
  for (const vulnerability of vulnerabilities) {
    if (
      !vulnerability ||
      typeof vulnerability !== "object" ||
      !blockingSeverities.has(vulnerability.severity)
    )
      continue;
    const detail = Array.isArray(vulnerability.via)
      ? vulnerability.via.find((entry) => entry && typeof entry === "object")
      : undefined;
    blocking.push(
      detail?.title ??
        vulnerability.name ??
        "unknown-high-or-critical-advisory",
    );
  }

  return { blocking, ignored };
}

function run() {
  const audit = spawnSync("pnpm", ["audit", "--json"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (audit.error) {
    console.error(`Security audit could not start: ${audit.error.message}`);
    return 1;
  }
  if (audit.status !== 0 && audit.status !== 1) {
    console.error(audit.stderr || "Security audit failed without a report.");
    return 1;
  }

  let report;
  try {
    report = JSON.parse(audit.stdout);
  } catch {
    console.error("Security audit returned an invalid report.");
    return 1;
  }
  if (report?.error) {
    console.error(
      `Security audit response error: ${JSON.stringify(report.error)}`,
    );
    return 1;
  }
  if (!(report?.advisories || report?.vulnerabilities)) {
    console.error(
      "Security audit response did not contain vulnerability data.",
    );
    return 1;
  }
  const result = evaluateAuditReport(report);
  for (const id of result.ignored) {
    console.warn(
      `Temporarily ignoring ${id} through ${auditException.expiresAt} (${auditException.issue}).`,
    );
  }
  if (result.blocking.length > 0) {
    console.error(
      `Blocking security advisories: ${result.blocking.join(", ")}`,
    );
    return 1;
  }
  console.log("Security audit passed.");
  return 0;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  process.exitCode = run();
