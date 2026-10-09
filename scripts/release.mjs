#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function run(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
}

function manifest() {
  return JSON.parse(readFileSync("package.json", "utf8"));
}

function published(name, version) {
  try {
    const result = JSON.parse(
      run("npm", [
        "view",
        `${name}@${version}`,
        "version",
        "--json",
        "--registry",
        "https://registry.npmjs.org",
      ]),
    );
    if (result !== version) throw new Error("Unexpected npm version response.");
    return true;
  } catch (error) {
    if (error.stdout && JSON.parse(error.stdout).error?.code === "E404")
      return false;
    throw error;
  }
}

function githubRelease(tag) {
  try {
    return JSON.parse(
      run("gh", [
        "api",
        `repos/${process.env.GITHUB_REPOSITORY}/releases/tags/${tag}`,
      ]),
    ).html_url;
  } catch (error) {
    if (error.stderr?.includes("(HTTP 404)")) return null;
    throw error;
  }
}

function pack(directory) {
  run("pnpm", ["security:audit"]);
  rmSync("dist", { recursive: true, force: true });
  run("pnpm", ["build"]);
  run("pnpm", ["test"]);
  run("pnpm", ["lint"]);
  const [tarball] = JSON.parse(
    run("npm", [
      "pack",
      "--json",
      "--ignore-scripts",
      "--pack-destination",
      directory,
    ]),
  );
  if (!tarball?.filename)
    throw new Error("npm pack did not produce a tarball.");
  const pkg = manifest();
  if (
    tarball.name !== pkg.name ||
    tarball.version !== pkg.version ||
    !tarball.files?.some((file) => file.path === "dist/index.js") ||
    !tarball.files?.some((file) => file.path === "dist/index.d.ts")
  ) {
    throw new Error(
      "Packed package identity or compiled entry point is invalid.",
    );
  }
  return join(directory, tarball.filename);
}

function createRelease(tag) {
  return run("gh", [
    "release",
    "create",
    tag,
    "--title",
    tag,
    "--generate-notes",
    "--verify-tag",
  ]);
}

function publish(tarball) {
  run("npm", [
    "publish",
    tarball,
    "--access",
    "public",
    "--provenance",
    "--ignore-scripts",
    "--registry",
    "https://registry.npmjs.org",
  ]);
}

function requestPublication(tag) {
  const result = JSON.parse(
    run("gh", [
      "api",
      "--method",
      "POST",
      `repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/publish.yml/dispatches`,
      "-H",
      "X-GitHub-Api-Version: 2026-03-10",
      "-f",
      `ref=${tag}`,
    ]),
  );
  if (!Number.isSafeInteger(result.workflow_run_id))
    throw new Error("GitHub did not return the publishing run ID.");
  // A successful publishing job is authoritative while npm metadata propagates.
  run("gh", [
    "run",
    "watch",
    String(result.workflow_run_id),
    "--exit-status",
    "--interval",
    "5",
  ]);
}

function recover(name, version, tag) {
  const exists = published(name, version);
  const url = githubRelease(tag);
  if (exists && url) return;
  if (!exists) {
    requestPublication(tag);
    return;
  }
  // Older published tags may predate this workflow; repair their metadata here.
  const head = run("git", ["rev-parse", "HEAD"]);
  try {
    run("git", ["checkout", "--detach", tag]);
    createRelease(tag);
  } finally {
    run("git", ["checkout", "--detach", head]);
  }
}

function publishTag() {
  const { name, version } = manifest();
  const tag = `v${version}`;
  const head = run("git", ["rev-parse", "HEAD"]);
  if (
    process.env.GITHUB_REF !== `refs/tags/${tag}` ||
    !/^v\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(tag) ||
    head !== process.env.GITHUB_SHA ||
    run("git", ["rev-parse", `${tag}^{}`]) !== head
  )
    throw new Error(
      "Publishing requires the matching immutable release tag and workflow SHA.",
    );
  run("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"]);
  const directory = mkdtempSync(join(tmpdir(), "pocket-trash-release-"));
  try {
    if (!published(name, version)) publish(pack(directory));
    const url = githubRelease(tag) || createRelease(tag);
    console.log(`Published ${name}@${version} from ${head}. ${url}`);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function main() {
  if (
    process.env.GITHUB_ACTIONS !== "true" ||
    (process.env.GITHUB_REF !== "refs/heads/main" &&
      !(
        process.argv[2] === "--publish-tag" &&
        process.env.GITHUB_REF?.startsWith("refs/tags/v")
      )) ||
    !process.env.ACTIONS_ID_TOKEN_REQUEST_URL ||
    !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  ) {
    throw new Error(
      "Releases require GitHub Actions on main with npm Trusted Publishing.",
    );
  }
  if (process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN) {
    throw new Error(
      "npm access tokens are not supported; use Trusted Publishing.",
    );
  }
  if (run("git", ["status", "--porcelain"]))
    throw new Error("Release requires a clean working tree.");
  if (process.argv[2] === "--publish-tag") return publishTag();
  if (process.argv.length !== 2)
    throw new Error("Unexpected release arguments.");
  const { name, version } = manifest();
  const tag = `v${version}`;
  const pending = readdirSync(".changeset").some(
    (file) => file.endsWith(".md") && file !== "README.md",
  );
  if (run("git", ["tag", "--list", tag])) {
    run("git", ["merge-base", "--is-ancestor", tag, "HEAD"]);
    const source = JSON.parse(run("git", ["show", `${tag}:package.json`]));
    if (source.name !== name || source.version !== version)
      throw new Error("Release tag does not match the package.");
    recover(name, version, tag);
  }
  if (!pending) {
    console.log("Nothing to release.");
    return;
  }
  const directory = mkdtempSync(join(tmpdir(), "pocket-trash-release-"));
  try {
    run("pnpm", ["security:audit"]);
    run("pnpm", ["run", "changeset:version"]);
    run("pnpm", ["install", "--lockfile-only"]);
    const next = manifest();
    if (next.name !== name || next.version === version)
      throw new Error("Changesets did not advance the package version.");
    const nextTag = `v${next.version}`;
    if (run("git", ["tag", "--list", nextTag]))
      throw new Error(`Release tag ${nextTag} already exists.`);
    if (published(next.name, next.version))
      throw new Error(
        `npm already contains ${next.name}@${next.version} without its release tag.`,
      );
    pack(directory);
    const changes = run("git", ["status", "--porcelain"]).split("\n");
    if (
      changes.some(
        (line) =>
          !/^(package\.json|pnpm-lock\.yaml|CHANGELOG\.md|\.changeset\/[^/]+\.md)$/.test(
            line.slice(3),
          ),
      )
    ) {
      throw new Error("Validation changed unexpected release files.");
    }
    run("git", [
      "add",
      "package.json",
      "pnpm-lock.yaml",
      "CHANGELOG.md",
      ".changeset",
    ]);
    run("git", ["commit", "-m", `chore: release ${nextTag} [skip ci]`]);
    run("git", ["tag", "-a", nextTag, "-m", nextTag]);
    run("git", [
      "push",
      "--atomic",
      "origin",
      "HEAD:refs/heads/main",
      `refs/tags/${nextTag}`,
    ]);
    requestPublication(nextTag);
    console.log(
      `Completed ${next.name}@${next.version} from ${run("git", ["rev-parse", "HEAD"])}.`,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
