# Publishing

Use Changesets to record versioned package changes. Use commits to keep the
release history readable.

## Regular Changes

1. Make the code or catalog change.
2. Run tests:

```sh
npm ci
npm test
```

3. Add a changeset:

```sh
npx changeset
```

4. Commit the code and generated `.changeset/*.md` file together:

```sh
git add .
git commit -m "Add Spanish copy for save action"
```

## Version Commits

When preparing a release, apply the pending changesets:

```sh
npx changeset version
npm test
git add .
git commit -m "Version packages"
```

Push that commit and create a GitHub release for the new version.

## Publishing Workflow

Publishing runs through `.github/workflows/publish.yml`.

The workflow currently runs when a GitHub release is published or when it is
started manually with `workflow_dispatch`. It does not run automatically on
merges to `main`.
