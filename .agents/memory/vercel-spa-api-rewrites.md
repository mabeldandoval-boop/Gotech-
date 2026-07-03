---
name: Vercel SPA rewrite + serverless API coexistence
description: Confirms a catch-all SPA rewrite in vercel.json does not break /api/* serverless functions.
---

A `vercel.json` with:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
does NOT break `/api/*` serverless functions living in an `api/` directory.

**Why:** Vercel's routing resolves actual files and Serverless Functions (including anything under `api/`) before applying the `rewrites` array; rewrites only act as a fallback for paths that don't match a real file or function. This is the standard pattern for SPA + API on Vercel.

**How to apply:** No need to add an explicit `{"source": "/api/(.*)", "destination": "/api/$1"}` exception before the catch-all rewrite — the default behavior already prioritizes `/api/*` functions correctly.
