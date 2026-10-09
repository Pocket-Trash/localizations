# Publishing

Use Changesets to record versioned package changes. Use commits to keep the
release history readable.

## Regular Changes

1. Make the code or catalog change.
2. Run tests:

```sh
pnpm install
pnpm security:audit
pnpm test
```

3. Add a changeset:

```sh
pnpm changeset
```

4. Commit the code and generated `.changeset/*.md` file together:

```sh
git add .
git commit -m "Add Spanish copy for save action"
```

## Automatic releases and manual retries

Merges to `main` automatically publish pending Changesets through
[Publish](https://github.com/Pocket-Trash/localizations/actions/workflows/publish.yml).
Use an authenticated GitHub CLI to retry a failed release:

```sh
pnpm release
```

The command dispatches `publish.yml` on remote `main`. It queues a run rather
than publishing the local checkout or waiting for success. Check the returned
run link, or use `gh run list --workflow publish.yml` and
`gh run watch <run-id> --exit-status`.
Humans and agents use this same workflow without local npm login, an OTP, or
an npm access token.

The runner blocks on the high/critical audit, lint, changelog validation,
build, and tests. It uses `changeset:version` to combine Changesets into the
root `CHANGELOG.md`, stamp the release date, and bump the package version.
It refreshes the lockfile and validates the versioned tarball before pushing
its release commit and annotated tag atomically. npm publishes that tarball
through OIDC, and the workflow creates the matching GitHub release.

A retry recovers an incomplete release from its exact tagged source before
consuming newer Changesets. An already-published version is never republished;
a missing GitHub release can be repaired independently. Completed releases
are a no-op. Network, authentication, and server errors stop the run rather
than being interpreted as missing versions. Release commits use `[skip ci]`
to avoid scheduling another automatic release.

## One-time npm and GitHub setup

1. Configure the npm trusted publisher for `@pocket-trash/localizations`:
   organization `Pocket-Trash`, repository `localizations`, workflow filename
   `publish.yml`, with direct `npm publish` permission. Complete a successful
   first publish within npm's two-day validation window. After validation,
   disallow traditional tokens in the package's publishing-access settings.
2. Install the release GitHub App on this repository with Contents write access.
   Add it as an always-allowed bypass actor on the existing `main` ruleset;
   ordinary PR approval and Security requirements remain required.
3. Set repository variable `RELEASE_APP_ID` and Actions secret
   `RELEASE_APP_PRIVATE_KEY`. The App's short-lived credential permits git
   writes; the job's GitHub token creates release metadata. npm authenticates
   only through OIDC; do not configure `NPM_TOKEN` or `NODE_AUTH_TOKEN`.

The workflow accepts only `main` and serializes releases on GitHub-hosted
runners. It installs npm 11.20.0 for OIDC and uses an isolated temporary npm
configuration. Missing setup fails safely; retry after completing it.
Setup is tracked by
[ENG-429](https://linear.app/pocket-trash/issue/ENG-429/set-up-localizations-trusted-publishing-in-npm-and-github).
