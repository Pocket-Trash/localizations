# System Instructions

- Pocket Trash repo skills live in `../pocket-trash-skills` as the single source of truth for Codex and Claude Code. Install them with `npx skills add Pocket-Trash/pocket-trash-skills -a codex -a claude-code`. Do not edit local skill copies in this repo; update the shared repo instead.
- After code changes, run:
  - `pnpm format`
  - `pnpm lint`
  - `pnpm test`
- For documentation-only changes, run only `pnpm format`.
