# Agents guide for Crawler Lab for LLM and coding agents
1. Scope
- This file governs the entire repository until another AGENTS.md overrides it.
- No nested AGENTS files currently exist; these rules apply everywhere.
- There are no Cursor rules (.cursor/ or .cursorrules) in this repo.
- There are no Copilot instructions (.github/copilot-instructions.md) in this repo.
2. Quick Facts
- Project name: crawl-lab (Scraper Tester API).
- Stack: Node.js (ES modules) with Hono.
- Entry: `src/index.js` creates the Hono app and exports default.
- Routing: configured in `src/routes.js` using handler modules.
- Config: `wrangler.toml` with `nodejs_compat` for Cloudflare Workers.
3. Dependency Management
- Use pnpm for installs (`pnpm install`); lockfile is pnpm-lock.yaml.
- Avoid npm/yarn unless explicitly requested.
- Keep dependencies minimal; prefer standard library and Hono utilities.
- Use exact version ranges already chosen unless a security fix is required.
4. Scripts and Commands
- Start (production-like, Node): `pnpm start` (runs `node src/index.js`).
- Dev watch (Node): `pnpm dev` (runs `node --watch src/index.js`).
- Cloudflare Workers: default entry is `src/index.js`; run via `pnpm dlx wrangler dev` or `pnpm dlx wrangler deploy` if needed (no script wired yet).
- Install deps: `pnpm install`.
- No build step beyond Node/Wrangler bundling; keep source ESM-compatible.
5. Tests and Linting
- There is no test suite configured; no `pnpm test` script exists.
- There is no lint/format command configured.
- If you add tests, prefer pnpm scripts (e.g., `pnpm test -- <pattern>` for single-test runs) and document them here.
- Until a linter is added, preserve existing style manually.
6. Repository Layout
- `src/index.js`: bootstraps app, conditionally starts Node server, exports default.
- `src/app.js`: builds Hono app and applies routes.
- `src/routes.js`: registers all endpoints and `notFound` handler.
- `src/handlers/*.js`: grouped endpoint handlers by domain (status, content, special, js, forum, size, assets).
- `src/pages/index.js`: builds the HTML index listing all routes.
- `public/`: static assets (`files/pdf/sample.pdf`, `images/sample.png`, `js/render.js`).
- `.wrangler/`: local wrangler state; avoid editing.
- `wrangler.toml`: worker config (compatibility date, flags).
7. Module and Import Style
- Use ES modules with explicit `.js` extensions for relative imports.
- Prefer `node:` prefix for built-in modules (e.g., `node:url`).
- Keep imports grouped: external packages first, then local modules.
- Use named exports per handler file (e.g., `export function handleX`); default export only for the app in `src/index.js`.
8. Formatting Conventions
- Indentation: 2 spaces; avoid tabs.
- Semicolons are used; keep them.
- Keep lines readable; favor wrapping long template strings via multiline literals.
- No automatic formatter is configured; maintain existing spacing and blank-line usage.
- Use trailing commas only where already present; do not reformat JSON-style blocks aggressively.
9. Strings and Templates
- Use template literals for multiline responses and HTML construction.
- Prefer single quotes for simple strings; use double quotes when matching JSON payload conventions.
- Keep embedded content at 200+ characters where endpoints expect substantial bodies for scraper testing.
- Escape backticks appropriately inside template literals.
10. Types and Data Handling
- Codebase is plain JavaScript; no TypeScript types are expected.
- Use explicit parsing for numbers (e.g., `Number.parseInt(..., 10)`), not implicit casting.
- Handle `undefined` safely when reading query params, env vars, or process globals.
- When reading request params/queries, default sensibly (`??`) and validate ranges.
11. Error and Input Handling
- Prefer early returns for invalid inputs with clear text responses (see `handleStatus`, `handleLongResponse`).
- Use Hono helpers (`c.text`, `c.html`, `c.json`, `c.newResponse`, `c.redirect`) instead of manual `Response` where possible.
- Set status codes explicitly in response helpers (second arg or options object).
- For empty bodies, use `c.newResponse(null, { status, headers })` and set `Content-Length: 0` when appropriate.
12. Routing Patterns
- Register routes in `setupRoutes` within `src/routes.js`; keep grouping by domain (status, js, special, content, forum, size, assets).
- Use path casing consistent with current endpoints (e.g., `/100Kb`, `/1Mb`, `/10Mb`).
- Default `notFound` handler returns descriptive text; keep consistency if extending.
13. Content Conventions
- Responses are intentionally verbose (200+ chars) to simulate real pages; maintain this when adding endpoints.
- HTML responses avoid styling/CSS to keep scraper behavior predictable.
- Content-type endpoints must set correct headers (`text/markdown`, `application/json`, `application/xml`, `text/html`, `text/plain`, `text/csv`, `text/tab-separated-values`).
- Forum endpoints support pagination via `?page=` query; preserve semantics if adjusting.
14. JavaScript-Rendered Pages
- JS-rendered endpoints are defined in `src/handlers/js.js` and rely on assets in `public/js/render.js`.
- Keep inline vs external distinctions: `/js/inline` embeds scripts, `/js/external` loads from `/js/render.js`.
- `/js/image.png` builds an image dynamically; keep route naming consistent.
15. Asset Handling
- `/pdf` and `/simple.pdf` serve `public/files/pdf/sample.pdf`.
- `/image.png` serves `public/images/sample.png`.
- Maintain file availability in `public/` when changing assets; avoid renaming without updating routes and README.
16. Size Endpoints and Environment Variables
- `PATH_100KB`, `PATH_1MB`, `PATH_10MB` configure external file URLs used by size endpoints.
- Both Node (`process.env`) and Workers (`c.env`) are supported; check both when reading env vars.
- Default values are placeholder `https://example.com/...` URLs; keep placeholders realistic.
- Validate query/environment inputs and keep messaging descriptive.
17. Randomness and Determinism
- `handleUuid` uses `crypto.randomUUID()`; no seeding.
- `handleRandom` builds random text; function `generateRandomText` should remain deterministic per request body construction.
- Avoid introducing global mutable state or cross-request caches.
18. Timeouts and Delays
- `handleLongResponse` uses `setTimeout` via `await new Promise` pattern; keep async/await style.
- Validate `responseAfter` between 0 and 300 seconds; mirror current guardrails.
- Avoid blocking loops; use async waits only.
19. Naming Conventions
- Handlers: `handleX` functions exported individually.
- Builders: `buildApp`, `setupRoutes`, `buildIndexHtml`.
- Constants: lowerCamelCase unless representing immutable maps (e.g., `statusMessages`, `statusEntries`).
- Route files grouped by domain rather than single monolith; follow pattern.
20. Logging and Console Output
- `src/index.js` logs server start once; keep logs minimal and descriptive.
- Avoid noisy logging inside handlers unless debugging; prefer removing before commit.
21. Performance and Memory
- Keep responses simple strings; avoid heavy computation.
- When adding large payloads, prefer static strings over generating per-request unless randomness is needed.
- Do not stream files unless necessary; current design returns plain text/HTML.
22. Security and Headers
- Do not trust user input; validate params and queries.
- Set content types explicitly for every custom response.
- Avoid exposing secrets; env vars used only for external URLs.
23. Worker vs Node Compatibility
- Ensure APIs work in both Node and Cloudflare Workers (nodejs_compat enabled).
- Avoid Node-only APIs unless guarded by `if (typeof process !== 'undefined')` checks.
- Keep imports compatible with bundlers (explicit extensions, ESM only).
24. Adding New Dependencies
- Justify any new package; prefer zero-dependency helpers.
- Update `package.json` scripts if new build/test tools are added; document commands here.
- Maintain `pnpm` overrides section if modifying transitive dependencies.
25. Documentation Expectations
- Update `README.md` when adding routes or changing setup steps.
- Keep AGENTS.md in sync with new commands, tests, or style rules.
- Add inline comments only when necessary for non-obvious logic; code is mostly self-explanatory now.
26. Git and Contribution Notes
- Do not commit unless explicitly asked in task instructions.
- Keep changes minimal and focused on requested scope.
- Preserve existing file structure and naming; avoid churn.
27. Running Single Endpoints Locally
- Use `pnpm dev` for hot reload; server listens on `PORT` (default 3000).
- Override port via `PORT=8080 pnpm start` as shown in README.
- For targeted checks, hit specific routes with curl (e.g., `curl http://localhost:3000/status/404`).
28. Testing Guidance (future-proof)
- When a test runner is added, prefer `pnpm test -- <pattern>` for single-test execution.
- Co-locate tests near source files or in a `tests/` directory; mirror ESM setup.
- Mock external env vars for size endpoints; avoid hitting real URLs in unit tests.
29. Style Examples from Codebase
- `src/routes.js` groups route registrations with simple arrow handlers.
- `src/handlers/status.js` shows early validation and `c.text` usage with status codes.
- `src/pages/index.js` demonstrates HTML assembly via helper `section` and template literals.
- Follow these patterns for consistency when adding new features.
30. Final Notes
- Keep responses deterministic and verbose to support scraper validation.
- Maintain compatibility with Cloudflare Workers and Node without branching code unnecessarily.
- When unsure about style, mirror adjacent files instead of introducing new conventions.
- Re-run relevant start/dev commands after changes to confirm the server boots.
- Keep this document around ~150 lines; extend carefully if new rules are needed.
