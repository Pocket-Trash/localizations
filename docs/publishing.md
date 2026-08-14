# Publishing

Use Changesets to record versioned package changes. Use commits to keep the
release history readable.

## Regular Changes

1. Make the code or catalog change.
2. Run tests:

```sh
pnpm install
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

## Version Commits

Run the publish workflow when you want to release the pending changesets:

```sh
pnpm run changeset:version
```

The version step combines changesets into `CHANGELOG.md`, bumps
`package.json`, updates `pnpm-lock.yaml`, commits those files back to `main`,
and publishes the package.

## Publishing Workflow

Publishing runs through `.github/workflows/publish.yml`.

The workflow runs when started manually with `workflow_dispatch`. Pull requests
must include a release changeset. Major changesets add the `Major` label to the
pull request.
