# System Instructions

- Pocket Trash repo skills come from `https://github.com/Pocket-Trash/skills` as the single source of truth for Codex and Claude Code. At repo session start, compare the `pocket-trash*` entries and hashes in `skills-lock.json` and `.agents/skills` with the skills currently published from that repo's `skills/*/SKILL.md` files. Keep this check read-only. If the installed skills are missing or stale, ask the user for permission to run `npx skills add pocket-trash/skills --skill '*' --agent codex claude-code -y`. If permission is declined or the command cannot run, tell the user to run that exact command. Do not edit local skill copies directly; update the shared repo instead.
- After code changes, run:
  - `pnpm format`
  - `pnpm lint`
  - `pnpm test`
- For documentation-only changes, run only `pnpm format`.
