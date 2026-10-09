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

function recover(name, version, tag) {
  const exists = published(name, version);
  let url = githubRelease(tag);
  if (exists && url) return;
  const head = run("git", ["rev-parse", "HEAD"]);
  const directory = mkdtempSync(join(tmpdir(), "pocket-trash-release-"));
  try {
    run("git", ["checkout", "--detach", tag]);
    if (!exists) {
      run("pnpm", ["install", "--frozen-lockfile"]);
      publish(pack(directory));
    }
    if (!url) url = createRelease(tag);
    console.log(
      `Recovered ${name}@${version} from ${run("git", ["rev-parse", "HEAD"])}. ${url}`,
    );
  } finally {
    run("git", ["checkout", "--detach", head]);
    if (!exists) run("pnpm", ["install", "--frozen-lockfile"]);
    rmSync(directory, { recursive: true, force: true });
  }
}

function main() {
  if (
    process.env.GITHUB_ACTIONS !== "true" ||
    process.env.GITHUB_REF !== "refs/heads/main" ||
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
    const tarball = pack(directory);
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
    publish(tarball);
    const url = createRelease(nextTag);
    console.log(
      `Published ${next.name}@${next.version} from ${run("git", ["rev-parse", "HEAD"])}. ${url}`,
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
