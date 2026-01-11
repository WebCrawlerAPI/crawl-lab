# AGENTS.md for Scraper Tester

## Repository Context
This repository hosts a minimal Express.js application that exposes a wide variety of endpoints for testing scraper behaviour.
The code is intentionally small so that every handler stays visible and easy to adjust as new scraping heuristics are explored.
All work happens in the `src` folder; no submodules, packages, or hidden build steps exist beyond the Express app and its handlers.
Static assets (PDF, PNG, large files) live under `public` and are wired through explicit routes so agents can inspect them easily.
Use this AGENTS.md as the definitive reference for build/runtime commands, conventions, and manual test procedures before introducing more automation.

## Commands Overview
### Setup
- `pnpm install` keeps dependencies in sync; the lockfile (`pnpm-lock.yaml`) must always be updated when package versions change.
- No other package manager is supported here; do not run `npm` or `yarn` commands because pnpm's path resolution is expected by the dev scripts.

### Running the application
- `pnpm dev` launches `node --watch src/index.js`, restarting the server on changes while keeping the port at `3000` by default.
- `pnpm start` runs `node src/index.js` for simple production-style execution and is the script that should be used in deployed builds.
- `PORT=8080 pnpm start` shows how to override the default port without editing code.
- `node src/index.js` may be used directly when experimenting with different node options or per-route debugging.

### Linting and formatting
- There is no built-in lint or formatter script in this repository yet.
- Agents should rely on their own preferred linter/formatter (for example, `pnpm lint` would fail) and keep the coding style described below consistent during commits.
- Formatters should be configured externally if introduced later; do not assume a shared formatter unless a new script is added and documented here.

### Testing commands (single test focus)
- The repository does not currently provide automated unit or integration tests; instead, exercise endpoints manually with HTTP clients.
- A single representative test is to hit the status code endpoint and assert the 200 response:
  - `curl -i http://localhost:3000/status/200` demonstrates that the route resolves, the response text is long enough (200+ characters), and the status code honours the path parameter.
- Additional manual checks include:
  - `curl -I http://localhost:3000/json` to inspect headers and confirm `application/json` content type.
  - `curl -L http://localhost:3000/redirect/temporary-to-200` to verify redirect behaviour.
- Document any automated tests you add beneath this section so future agents know exactly how to run them (single-test commands should include the `curl` equivalent or a focused `pnpm run test ...` call if created later).

### Manual QA checkpoints
- After starting the server, verify `/status/200` returns 200 and a descriptive message of 200+ characters.
- Use `/json`, `/xml`, `/markdown`, and `/html` to confirm `Content-Type` headers and payload structures.
- Exercise `/random` to check that the dynamic text endpoint varies on consecutive requests.
- Ping `/long-response?responseAfter=5` (or other values) to ensure the response delay honours the query parameter without hanging indefinitely.
- Request `/pdf`, `/simple.pdf`, and `/image.png` so that their `public` assets load rather than returning 404.
- With environment variables set, hit `/100Kb`, `/1Mb`, and `/10Mb` to confirm external-proxied URLs are returned verbatim in the response text.
- Check `/forum?page=1` and `/forum?page=2` to ensure pagination query parameters are parsed and a consistent payload is returned.
- Always finish manual runs with `/` to confirm the index page still lists every endpoint and uses the helper `section` pattern consistently.

## Coding Style and Architecture
### Modules and import style
- All code uses ECMAScript modules (`import` / `export`); do not switch to CommonJS without repository-wide approval.
- Keep imports grouped by source: third-party modules first (`express`, `uuid`), then Node core (`path`, `url`), then local paths.
- Prefer single-quote strings (`'express'`, `'./handlers/status.js'`) unless you need double quotes inside the literal; template literals are permitted for multi-line / interpolated content.
- Group related handler imports into one statement when they originate from the same file but avoid extremely long lines; wrapping the import across multiple lines is acceptable if the linter/formatter has been configured.

### Export and naming conventions
- Handler functions follow the `handleXyz` pattern (`handleMarkdown`, `handleJson`, `handleStatus`); keep this naming consistent so the router is easy to read.
- Constants that represent configuration maps (e.g., `statusMessages`, `statusEntries`) should be `const` and use descriptive camelCase names.
- Do not export anonymous functions from handler modules; always give them a name (this improves stack traces and makes the router imports consistent).

### Formatting and whitespace
- Use two spaces for indentation throughout JavaScript files.
- Keep blank lines between exported functions to separate their responsibilities, but avoid excessive vertical whitespace inside a single handler.
- End each statement with a semicolon; the existing codebase consistently uses semicolons even though JavaScript would insert them automatically.
- Long template strings (HTML, JSON, XML) should be written with backticks and aligned so their indentation mirrors the resulting payload structure.
- Wrap long, descriptive text (e.g., scraping guidance messages) across multiple lines to remain readable in diffs while preserving the final string via template literals.

### Handler structure and behaviours
- Each handler should accept `(req, res)` and immediately determine its output without relying on global mutable state.
- Use `res.type(...)` to set `Content-Type` explicitly before calling `.send()` or `.json()` to avoid guessing by Express.
- Prefer `return res.status(...).send(...)` when terminating early (this keeps the handler body flat and prevents fall-through logic).
- Keep asynchronous work out of these handlers for now; none of the existing endpoints rely on Promises, so avoid introducing async/await unless the feature explicitly requires it.
- When selecting response content, ensure strings exceed 200 characters; this matches the design goal of providing substantial payloads for scraping tests.

### Route wiring expectations
- The router (`src/routes.js`) centralises every path; add new handlers by importing them near the top and wiring them via `app.get` or `app.use` below the existing sections (status, JS, special, content, etc.).
- The index route builds HTML using small helper functions (e.g., `section`) and raw template strings; keep that pattern if the landing page grows.
- Static assets must be served explicitly through `express.static` with relative paths computed from `__dirname` / `import.meta.url` as shown in `setupRoutes`.
- Always include a fallback middleware at the bottom that returns `404` and a descriptive text body; this ensures missing endpoints report back to agents clearly.

### Descriptive logging and error handling
- The current logging is limited to the startup message printed on line 12 of `src/index.js`; keep logs lean and focused on state changes (server start, configuration values).
- Validate route inputs explicitly (for example, `parseInt(req.params.code, 10)` followed by checking `statusMessages[code]`); respond with `400` and human-readable text for invalid parameters.
- Avoid throwing uncaught exceptions in handlers; instead, send a textual error with a relevant HTTP status so that scraping clients can interpret the failure.
- If you add middleware that needs error forwarding, call `next(err)` and place an error-handling middleware near the end of `setupRoutes` to log and respond consistently.

### Content and asset conventions
- `public` is divided into `files/pdf`, `images`, and `js`; mirror this structure when you add new static assets and update the route reference accordingly.
- The `/100Kb`, `/1Mb`, `/10Mb` routes proxy to environment variables (`PATH_100KB`, etc.) so that large-file tests can point to a CDN; document any updates to those environment variables here.
- Keep the `handlers/assets.js`, `handlers/size.js`, and other specialised modules small and focused; relocate shared helper logic to new modules under `src/handlers` rather than bloating a single handler file.

## Environment and Configuration
- `PORT` defaults to 3000 and can be overridden in the shell before starting the server (`PORT=8080 pnpm start`).
- Configure external size endpoints by setting `PATH_100KB`, `PATH_1MB`, and `PATH_10MB` to valid URLs that respond with the requested payload size.
- High-level configuration guidance lives in `README.md`; update that document if you add new runtime knobs or expected asset locations.
- Keep environment variables and runtime data short-lived and clearly documented so other agents can reproduce the same scenarios.
- When adding new configuration switches, prefer using `process.env` with sensible defaults and fail-fast validation messages so tests surface meaningful errors.

## Debugging and Maintenance
- `pnpm dev` is the quickest way to iterate because it restarts the server after every change; keep the terminal window visible to catch syntax errors on startup.
- Logs should stay minimal; only record port changes, environment detection, or critical failures. Additional logging should be added sparingly and consistently.
- When investigating why a route fails, reproduce the issue with `curl` or HTTPie before editing the handler so you can compare responses pre/post change.
- If you add middleware that manipulates the request, make sure it returns or calls `next()` to avoid hanging requests in the stack.
- Keep payloads descriptive: response texts, JSON messages, and headers should clearly explain the scenario to help downstream scraping clients understand what to expect.
- Run local smoke tests after each change that touches routing to ensure there are no unhandled promises or early exits.

## Collaboration Notes
- Link new endpoints or major behaviour changes back to the README so future agents know exactly where to look.
- Discuss significant architectural shifts (for example, adding a new handler directory or switching HTTP libraries) with the team before committing.
- Remember that this project is intentionally small; prefer clear and verbose responses over clever or overly compressed code.

## Release and Deployment
- Before tagging a release or pushing a production candidate, run `pnpm start` and exercise the full suite of endpoints to catch regressions in routing or static assets.
- Log the port and any environment overrides at startup so reviewers can trace which configuration was used during the last manual smoke test.
- If you change dependency versions, update `pnpm-lock.yaml`, rerun `pnpm install`, and mention the rationale in your change description.
- Keep the `public` assets under version control; do not generate or commit compiled assets from outside tools.
- Document any new environment variables in both `README.md` and this AGENTS file so other agents can recreate the scenario.
- Double-check large-file proxy endpoints (`/100Kb`, `/1Mb`, `/10Mb`) after any network-related change to ensure the URLs respond with the expected payload size.

## Testing Additions
- When you do add automated tests, keep them focussed on one endpoint so they can be invoked with a single `curl` or lightweight script.
- Always include the exact command that runs the test in this section so downstream agents can reproduce it without guessing.
- Prefer `curl` or `node` scripts that validate HTTP status, headers, and payload length without relying on heavyweight frameworks.
- Mention any new test data files (PDFs, images, JSON samples) in the README so they are bundled with the repo.
- Describe how to run the tests manually if they require special environment variables or preconditions.

## Cursor and Copilot Rules
- A search for `.cursor/rules/` and `.cursorrules` returned no files in this repository.
- The `.github/copilot-instructions.md` file does not exist either, so there are no additional Copilot directives to adopt.
- If these files appear later, update this section with their paths and a short summary of the enforced rules.
- A search for `.cursor/rules/` and `.cursorrules` returned no files in this repository.
- The `.github/copilot-instructions.md` file does not exist either, so there are no additional Copilot directives to adopt.
- If these files appear later, update this section with their paths and a short summary of the enforced rules.

## Additional Notes
- Refer back to `README.md` for explanations of the endpoints, asset expectations, and Cloudflare Workers deployment notes.
- Keep `package.json` scripts limited to what is absolutely necessary; any new script should be described here before being added.
- When in doubt, mimic the existing handler style rather than introducing large formatting or structural changes in one go.
- Use `public/js` for supplemental client-side helpers; no bundlers or transpilers are configured, so keep any JavaScript there vanilla.
- Ensure all newly added endpoints follow the same design principle: descriptive text, explicit headers, and isolation into a dedicated handler module.
- Keep the README index in sync with `setupRoutes` so every link on `/` remains accurate.
- Update `statusEntries` or the HTML list if you add or remove status codes so the landing page reflects reality.
- When touching static assets, double-check that the `express.static` paths still reference the correct `public` subdirectories.
- Before pushing, run `pnpm dev` for a quick sanity check and watch the console for warnings or restart loops.
- Document any new environment knobs or proxies in both the README and this AGENTS file so future agents know how to reproduce the scenario.
