# Security audit exceptions

Security audit exceptions are narrow, temporary, and fail closed. The
repository's audit wrapper still blocks every unlisted high or critical
advisory, registry failure, invalid report, unexpected package, runtime path,
or expired exception.

## GHSA-vfj7-8cjw-p6xm

- Package: `braces@3.0.3`
- Review issue: `ENG-366`
- Owner: Pocket Trash Engineering
- Reviewed: 2026-10-06
- Expires: 2026-10-13 23:59:59 UTC
- Patched release: none at review time
- Reachability: dev-only transitive paths below `@changesets/cli`
- Input boundary: Changesets receives repository-controlled workspace and
  Changeset glob patterns; it does not process untrusted user patterns
- Decision: temporarily accept the stack-exhaustion denial-of-service risk only
  for this exact package, advisory, version, and dependency boundary

Remove the exception immediately when an upstream release eliminates the
affected path. If no fix is available by expiry, a new review and code change
are required; extending the date without review is not permitted.
