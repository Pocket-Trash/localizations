import { readFile, writeFile } from "node:fs/promises";

const changelogPath = new URL("../CHANGELOG.md", import.meta.url);
const packagePath = new URL("../package.json", import.meta.url);

export function stampChangelogReleaseDate(content, version, date) {
  const heading = `## ${version}`;
  const index = content.indexOf(heading);

  if (index === -1) {
    throw new Error(`Could not find ${heading} in CHANGELOG.md`);
  }

  const insertAt = index + heading.length;
  const rest = content.slice(insertAt);

  if (/^\n\n_Published \d{4}-\d{2}-\d{2}\._/.test(rest)) {
    return content;
  }

  return `${content.slice(0, insertAt)}\n\n_Published ${date}._${rest}`;
}

async function main() {
  const [{ version }, changelog] = await Promise.all([
    readFile(packagePath, "utf8").then(JSON.parse),
    readFile(changelogPath, "utf8"),
  ]);
  const date =
    process.env.RELEASE_DATE ?? new Date().toISOString().slice(0, 10);
  const stamped = stampChangelogReleaseDate(changelog, version, date);

  if (stamped !== changelog) {
    await writeFile(changelogPath, stamped);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
