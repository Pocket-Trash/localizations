import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const runner = new URL("../scripts/release.mjs", import.meta.url);
const packageName = "@pocket-trash/localizations";

test("an already complete release is a no-op without another version", (t) => {
  const fixture = setup(t);
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Nothing to release/);
  assert.equal(fixture.git("rev-parse", "HEAD"), fixture.initialCommit);
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
});

test("pending Changesets publish a validated version with a matching git tag and GitHub release", (t) => {
  const fixture = setup(t);
  writeFileSync(
    join(fixture.cwd, ".changeset", "new.md"),
    "---\n---\nNew release.\n",
  );
  fixture.git("add", ".changeset/new.md");
  fixture.git("commit", "-m", "Add Changeset");
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fixture.state().published["1.0.1"], "original source");
  assert.ok(fixture.state().releases.includes("v1.0.1"));
  assert.equal(
    fixture.git("rev-parse", "v1.0.1^{}"),
    fixture.git("rev-parse", "HEAD"),
  );
  assert.equal(fixture.git("status", "--porcelain"), "");
});

test("a failed publish retries the tagged source before releasing newly merged Changesets", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  const failed = fixture.release({ FAIL_PUBLISH: "1" });
  assert.notEqual(failed.status, 0);
  assert.equal(
    fixture.git("rev-parse", "origin/main"),
    fixture.git("rev-parse", "v1.0.1^{}"),
  );
  writeFileSync(join(fixture.cwd, "source.txt"), "newly merged source");
  addChange(fixture);
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fixture.state().published["1.0.1"], "original source");
  assert.equal(fixture.state().published["1.0.2"], "newly merged source");
  assert.deepEqual(fixture.state().releases, ["v1.0.0", "v1.0.1", "v1.0.2"]);
});

test("publication uses the release tag as the signed workflow source", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    fixture.state().provenance["1.0.1"],
    fixture.git("rev-parse", "v1.0.1^{}"),
  );
});

test("recovery excludes modules removed from the following release", (t) => {
  const fixture = setup(t);
  writeFileSync(join(fixture.cwd, "old-module.txt"), "removed module");
  addChange(fixture);
  assert.notEqual(fixture.release({ FAIL_PUBLISH: "1" }).status, 0);
  unlinkSync(join(fixture.cwd, "old-module.txt"));
  addChange(fixture);
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fixture.state().artifacts["1.0.1"].includes("old-module.js"));
  assert.deepEqual(fixture.state().artifacts["1.0.2"], ["index.js"]);
});

test("a failed GitHub release is repaired without publishing or versioning again", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  assert.notEqual(fixture.release({ FAIL_RELEASE: "1" }).status, 0);
  const commit = fixture.git("rev-parse", "HEAD");
  const result = fixture.release();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fixture.git("rev-parse", "HEAD"), commit);
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0", "1.0.1"]);
  assert.equal(
    fixture.state().calls.filter((call) => call.includes("publish")).length,
    1,
  );
  assert.ok(fixture.state().releases.includes("v1.0.1"));
});

for (const code of ["E403", "ETIMEDOUT", "E500"]) {
  test(`registry ${code} blocks versioning and publication`, (t) => {
    const fixture = setup(t);
    addChange(fixture);
    const commit = fixture.git("rev-parse", "HEAD");
    assert.notEqual(fixture.release({ FAIL_REGISTRY: code }).status, 0);
    assert.equal(fixture.git("rev-parse", "HEAD"), commit);
    assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
  });
}

test("GitHub API errors do not masquerade as a missing release", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  const commit = fixture.git("rev-parse", "HEAD");
  assert.notEqual(fixture.release({ FAIL_GITHUB: "1" }).status, 0);
  assert.equal(fixture.git("rev-parse", "HEAD"), commit);
});

for (const env of [
  { GITHUB_ACTIONS: "" },
  { GITHUB_REF: "refs/heads/feature" },
  { ACTIONS_ID_TOKEN_REQUEST_TOKEN: "" },
  { NPM_TOKEN: "not-allowed" },
  { NODE_AUTH_TOKEN: "not-allowed" },
]) {
  test(`unsafe release environment is rejected: ${Object.keys(env)[0]}`, (t) => {
    const fixture = setup(t);
    assert.notEqual(fixture.release(env).status, 0);
    assert.deepEqual(fixture.state().calls, []);
  });
}

test("a tag publisher rejects a workflow SHA that differs from its source", (t) => {
  const fixture = setup(t);
  const result = fixture.release(
    { GITHUB_REF: "refs/tags/v1.0.0", GITHUB_SHA: "wrong-source" },
    ["--publish-tag"],
  );
  assert.notEqual(result.status, 0);
  assert.deepEqual(fixture.state().calls, []);
});

test("a tag outside protected main cannot publish", (t) => {
  const fixture = setup(t);
  const pkg = JSON.parse(
    readFileSync(join(fixture.cwd, "package.json"), "utf8"),
  );
  pkg.version = "1.0.1";
  writeFileSync(join(fixture.cwd, "package.json"), JSON.stringify(pkg));
  fixture.git("add", "package.json");
  fixture.git("commit", "-m", "Unmerged source");
  fixture.git("tag", "v1.0.1");
  const result = fixture.release({ GITHUB_REF: "refs/tags/v1.0.1" }, [
    "--publish-tag",
  ]);
  assert.notEqual(result.status, 0);
  assert.deepEqual(fixture.state().calls, []);
});

test("a failed tag dispatch preserves the pushed version for manual retry", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  assert.notEqual(fixture.release({ FAIL_DISPATCH: "1" }).status, 0);
  const source = fixture.git("rev-parse", "v1.0.1^{}");
  assert.equal(fixture.release().status, 0);
  assert.equal(fixture.git("rev-parse", "HEAD"), source);
  assert.equal(fixture.state().provenance["1.0.1"], source);
});

test("a dirty checkout cannot release", (t) => {
  const fixture = setup(t);
  writeFileSync(join(fixture.cwd, "source.txt"), "uncommitted");
  assert.notEqual(fixture.release().status, 0);
  assert.deepEqual(fixture.state().calls, []);
});

test("failed validation cannot push a version or publish", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  assert.notEqual(fixture.release({ FAIL_STEP: "lint" }).status, 0);
  assert.equal(fixture.git("tag", "--list", "v1.0.1"), "");
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
});

test("a conflicting version tag is never overwritten", (t) => {
  const fixture = setup(t);
  fixture.git("tag", "-a", "v1.0.1", "-m", "Conflicting source");
  const source = fixture.git("rev-parse", "v1.0.1^{}");
  addChange(fixture);
  assert.notEqual(fixture.release().status, 0);
  assert.equal(fixture.git("rev-parse", "v1.0.1^{}"), source);
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
});

test("a rejected atomic git push prevents npm publication and remote tag creation", (t) => {
  const fixture = setup(t);
  const hook = join(fixture.remote, "hooks", "pre-receive");
  writeFileSync(hook, "#!/bin/sh\nexit 1\n");
  chmodSync(hook, 0o755);
  addChange(fixture);
  assert.notEqual(fixture.release().status, 0);
  assert.equal(
    fixture.git("ls-remote", "--tags", "origin", "refs/tags/v1.0.1"),
    "",
  );
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
});

test("an existing registry version without a tag cannot be overwritten or tagged as new source", (t) => {
  const fixture = setup(t);
  const state = fixture.state();
  state.published["1.0.1"] = "other published source";
  fixture.setState(state);
  addChange(fixture);
  assert.notEqual(fixture.release().status, 0);
  assert.equal(fixture.git("tag", "--list", "v1.0.1"), "");
  assert.equal(fixture.state().published["1.0.1"], "other published source");
});

test("a package missing its compiled entry point cannot be released", (t) => {
  const fixture = setup(t);
  addChange(fixture);
  assert.notEqual(fixture.release({ FAIL_PACK: "1" }).status, 0);
  assert.equal(fixture.git("tag", "--list", "v1.0.1"), "");
  assert.deepEqual(Object.keys(fixture.state().published), ["1.0.0"]);
});

test("the workflow releases main automatically and exposes an OIDC manual retry", () => {
  const workflow = readFileSync(
    new URL("../.github/workflows/publish.yml", import.meta.url),
    "utf8",
  );
  const pkg = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.match(workflow, /push:\n\s+branches: \[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /if: github.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /ref: main/);
  assert.match(workflow, /node scripts\/release\.mjs/);
  assert.match(workflow, /group: publish-\$\{\{ github.ref_type \}\}/);
  assert.match(workflow, /actions: write/);
  assert.match(workflow, /node scripts\/release\.mjs --publish-tag/);
  const publisher = workflow.slice(workflow.indexOf("  publish:"));
  assert.match(publisher, /github.event_name == 'workflow_dispatch'/);
  assert.match(publisher, /refs\/tags\/v/);
  assert.match(publisher, /ref: \$\{\{ github.sha \}\}/);
  assert.doesNotMatch(
    publisher,
    /RELEASE_APP|steps.app|create-github-app-token/,
  );
  assert.doesNotMatch(workflow, /NPM_TOKEN|NODE_AUTH_TOKEN|npm whoami/);
  assert.equal(
    pkg.scripts.release,
    "gh workflow run publish.yml --repo Pocket-Trash/localizations --ref main",
  );
});

function addChange(fixture) {
  writeFileSync(
    join(fixture.cwd, ".changeset", "new.md"),
    "---\n---\nNew release.\n",
  );
  fixture.git("add", ".");
  fixture.git("commit", "-m", "Add change");
}

function setup(t) {
  const root = mkdtempSync(join(tmpdir(), "pocket-trash-release-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const cwd = join(root, "checkout");
  const remote = join(root, "remote.git");
  const bin = join(root, "bin");
  mkdirSync(cwd);
  mkdirSync(bin);
  mkdirSync(join(cwd, "scripts"));
  writeFileSync(join(cwd, "scripts/release.mjs"), readFileSync(runner, "utf8"));
  const statePath = join(root, "state.json");
  const git = (...args) =>
    execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "--bare", remote);
  git("init", "-b", "main");
  git("config", "user.name", "Release test");
  git("config", "user.email", "release@example.test");
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name: packageName, version: "1.0.0" }),
  );
  writeFileSync(join(cwd, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
  writeFileSync(
    join(cwd, "CHANGELOG.md"),
    "# Changelog\n\n## 1.0.0\n\nInitial.\n",
  );
  writeFileSync(join(cwd, "source.txt"), "original source");
  writeFileSync(join(cwd, ".gitignore"), "dist/\n");
  mkdirSync(join(cwd, ".changeset"));
  writeFileSync(join(cwd, ".changeset", "config.json"), "{}");
  git("add", ".");
  git("commit", "-m", "Initial");
  git("tag", "-a", "v1.0.0", "-m", "v1.0.0");
  git("remote", "add", "origin", remote);
  git("push", "-u", "origin", "main", "--tags");
  writeFileSync(
    statePath,
    JSON.stringify({
      published: { "1.0.0": "original source" },
      releases: ["v1.0.0"],
      calls: [],
      artifacts: {},
      provenance: {},
    }),
  );
  for (const name of ["pnpm", "npm", "gh"]) {
    const path = join(bin, name);
    writeFileSync(path, fakeCommands);
    chmodSync(path, 0o755);
  }
  return {
    cwd,
    remote,
    git,
    initialCommit: git("rev-parse", "HEAD"),
    state: () => JSON.parse(readFileSync(statePath, "utf8")),
    setState: (state) => writeFileSync(statePath, JSON.stringify(state)),
    release: (env = {}, args = []) =>
      spawnSync(process.execPath, [join(cwd, "scripts/release.mjs"), ...args], {
        cwd,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          RELEASE_TEST_STATE: statePath,
          GITHUB_SHA: git("rev-parse", "HEAD"),
          GITHUB_ACTIONS: "true",
          GITHUB_REF: "refs/heads/main",
          GITHUB_REPOSITORY: "Pocket-Trash/localizations",
          ACTIONS_ID_TOKEN_REQUEST_URL: "https://oidc.example.test",
          ACTIONS_ID_TOKEN_REQUEST_TOKEN: "test-oidc",
          NODE_AUTH_TOKEN: "",
          NPM_TOKEN: "",
          ...env,
        },
      }),
  };
}

const fakeCommands = `#!/usr/bin/env node
const { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync, existsSync, rmSync } = require("node:fs");
const { basename, dirname, join } = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const statePath = process.env.RELEASE_TEST_STATE;
const state = JSON.parse(readFileSync(statePath, "utf8"));
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
state.calls.push([command, ...args]);
function save() { writeFileSync(statePath, JSON.stringify(state)); }
function fail(code, message) {
  save(); console.log(JSON.stringify({ error: { code } })); console.error(message); process.exit(1);
}
function manifest() { return JSON.parse(readFileSync("package.json", "utf8")); }
if (command === "npm") {
    const version = manifest().version;
    if (args[0] === "view") {
      if (process.env.FAIL_REGISTRY) fail(process.env.FAIL_REGISTRY, "Registry failed");
      const queried = args[1].slice(args[1].lastIndexOf("@") + 1);
      if (!(queried in state.published)) fail("E404", "Version not found");
      console.log(JSON.stringify(queried));
    } else if (args[0] === "pack") {
      const path = join(args[args.indexOf("--pack-destination") + 1], "package.tgz");
      writeFileSync(path, JSON.stringify({ version, source: readFileSync("source.txt", "utf8"), files: readdirSync("dist") }));
      console.log(JSON.stringify([{ filename: "package.tgz", name: manifest().name, version,
        files: process.env.FAIL_PACK ? [] : [{ path: "dist/index.js" }, { path: "dist/index.d.ts" }] }]));
    } else if (args[0] === "publish") {
      if (process.env.FAIL_PUBLISH) fail("EAUTH", "Publish failed");
      const tarball = JSON.parse(readFileSync(args[1], "utf8"));
      if (tarball.version in state.published) fail("EPUBLISHCONFLICT", "Version exists");
      state.published[tarball.version] = tarball.source;
      state.artifacts[tarball.version] = tarball.files;
      state.provenance[tarball.version] = process.env.GITHUB_SHA;
    } else fail("UNKNOWN", "Unexpected npm command");
} else if (command === "pnpm") {
  if (args.join(" ") === "run changeset:version") {
    const pkg = manifest();
    const parts = pkg.version.split("."); parts[2] = String(Number(parts[2]) + 1); pkg.version = parts.join(".");
    writeFileSync("package.json", JSON.stringify(pkg));
    writeFileSync("CHANGELOG.md", "# Changelog\\n\\n## " + pkg.version + "\\n\\nNew release.\\n\\n## 1.0.0\\n\\nInitial.\\n");
    for (const name of readdirSync(".changeset")) if (name.endsWith(".md")) unlinkSync(join(".changeset", name));
  } else if (process.env.FAIL_STEP === args.join(" ")) fail("CHECK", "Validation failed");
  else if (args[0] === "build") {
    mkdirSync("dist", { recursive: true });
    writeFileSync("dist/index.js", readFileSync("source.txt", "utf8"));
    if (existsSync("old-module.txt")) writeFileSync("dist/old-module.js", readFileSync("old-module.txt", "utf8"));
  }
} else if (command === "gh") {
  if (args[0] === "api" && args.includes("POST")) {
    if (process.env.FAIL_DISPATCH) fail("HTTP500", "Dispatch failed");
    state.dispatch = args[args.indexOf("-f") + 1].slice(4);
    console.log(JSON.stringify({ workflow_run_id: 123 }));
  } else if (args[0] === "run" && args[1] === "watch") {
    save();
    const cwd = join(dirname(statePath), "publish-checkout");
    rmSync(cwd, { recursive: true, force: true });
    execFileSync("git", ["clone", "--quiet", process.cwd(), cwd]);
    execFileSync("git", ["remote", "set-url", "origin", execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" }).trim()], { cwd });
    execFileSync("git", ["fetch", "--quiet", "origin"], { cwd });
    execFileSync("git", ["checkout", "--quiet", "--detach", state.dispatch], { cwd });
    const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" }).trim();
    const result = spawnSync(process.execPath, [join(cwd, "scripts/release.mjs"), "--publish-tag"], {
      cwd, encoding: "utf8", env: { ...process.env, GITHUB_REF: "refs/tags/" + state.dispatch, GITHUB_SHA: sha }
    });
    Object.assign(state, JSON.parse(readFileSync(statePath, "utf8")));
    rmSync(cwd, { recursive: true, force: true });
    if (result.status !== 0) fail("PUBLISH", result.stderr);
  } else if (args[0] === "api") {
    const tag = args[1].split("/").pop();
    if (process.env.FAIL_GITHUB) fail("HTTP500", "API failed (HTTP 500)");
    if (!state.releases.includes(tag)) fail("HTTP404", "Not Found (HTTP 404)");
    console.log(JSON.stringify({ html_url: "https://github.example.test/releases/" + tag }));
  } else if (args[0] === "release" && args[1] === "create") {
    if (process.env.FAIL_RELEASE) fail("HTTP500", "Release creation failed");
    state.releases.push(args[2]);
    console.log("https://github.example.test/releases/" + args[2]);
  } else fail("UNKNOWN", "Unexpected gh command");
} else fail("UNKNOWN", "Local npm login must not be used");
save();
`;
