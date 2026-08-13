const PACKAGE_NAME = '@pocket-trash/localizations';

export function checkChangesets(files, packageName = PACKAGE_NAME) {
  const changesets = files.filter(
    ({ filename }) =>
      filename.startsWith('.changeset/') &&
      filename.endsWith('.md') &&
      filename !== '.changeset/README.md',
  );

  let hasRelease = false;
  let major = false;

  for (const file of changesets) {
    const bump = getPackageBump(file.content ?? '', packageName);
    if (!bump) continue;
    hasRelease = true;
    if (bump === 'major') major = true;
  }

  return { hasRelease, major };
}

export function getPackageBump(content, packageName = PACKAGE_NAME) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!frontmatter) return null;

  for (const line of frontmatter.split('\n')) {
    const match = line.trim().match(/^['"]?([^'":]+)['"]?:\s*(patch|minor|major)$/);
    if (match?.[1] === packageName) return match[2];
  }

  return null;
}

async function main() {
  const files = await getPullRequestChangesetFiles();
  const result = checkChangesets(files);

  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `has_release=${result.hasRelease}\nmajor=${result.major}\n`);
  }

  if (!result.hasRelease) {
    throw new Error(`Add a release changeset for ${PACKAGE_NAME}.`);
  }
}

async function getPullRequestChangesetFiles() {
  const token = requiredEnv('GITHUB_TOKEN');
  const repository = requiredEnv('GITHUB_REPOSITORY');
  const pullNumber = requiredEnv('PR_NUMBER');
  const [owner, repo] = repository.split('/');
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const files = [];

  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`GitHub files API failed: ${response.status} ${await response.text()}`);

    const pageFiles = await response.json();
    if (!pageFiles.length) break;

    for (const file of pageFiles) {
      if (
        file.filename.startsWith('.changeset/') &&
        file.filename.endsWith('.md') &&
        file.filename !== '.changeset/README.md' &&
        file.status !== 'removed'
      ) {
        files.push({ filename: file.filename, content: await fetchRaw(file.contents_url, headers) });
      }
    }
  }

  return files;
}

async function fetchRaw(url, headers) {
  const response = await fetch(url, { headers: { ...headers, Accept: 'application/vnd.github.raw' } });
  if (!response.ok) throw new Error(`GitHub raw file API failed: ${response.status} ${await response.text()}`);
  return response.text();
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function appendFile(path, content) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(path, content);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
