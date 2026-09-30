# System Instructions

- Pocket Trash repo skills come from `https://github.com/Pocket-Trash/skills` as the single source of truth for Codex and Claude Code. New worktrees install them automatically. Do not edit local skill copies directly; update the shared repo instead.
- After code changes, run:
  - `pnpm format`
  - `pnpm lint`
  - `pnpm test`
- For documentation-only changes, run only `pnpm format`.
