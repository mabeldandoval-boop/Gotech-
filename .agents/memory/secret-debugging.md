---
name: Secret handling in shell debugging
description: How to safely test whether a login/comparison endpoint is using a secret correctly without ever exposing the secret's value.
---

When debugging why a password/answer comparison endpoint rejects an input that "should" be correct, do NOT:
- Run `node -e "console.log(process.env.SECRET)"` or `JSON.stringify(secretValue)` to inspect it.
- Hardcode a guessed literal value and compare it against `process.env.SECRET` in a script whose output you will read.

Both of the above can print the raw secret into tool output/logs that become part of the visible conversation, which is a hard violation of "never display secret values."

**Why:** Did this once to debug a lockout/login flow — printed the actual admin password to the console output while trying to see why a guessed value didn't match. The mismatch turned out to be simply that the user had typed a different string than assumed; that's expected and fine, not a bug.

**How to apply:** Only check *presence* and *length* of an env var (`!!process.env.X`, `.length`) when debugging — never its content. If a hardcoded "expected" value doesn't match, trust that the real secret is whatever the user actually entered; do not try to reveal it to confirm. Validate the surrounding logic (lockout on failure, rejection without token, etc.) instead, which doesn't require knowing the secret.
