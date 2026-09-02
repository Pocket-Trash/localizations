# System Instructions

- Pocket Trash repo skills live in `../skills` as the single source of truth for Codex and Claude Code. Run `pnpm agent-skills:check` at repo session start. If it warns, run `pnpm agent-skills:update`. Do not edit local skill copies in this repo; update the shared repo instead.
- After code changes, run:
  - `pnpm format`
  - `pnpm lint`
  - `pnpm test`
- For documentation-only changes, run only `pnpm format`.
