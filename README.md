# Crawl Lab

Want to test your scaper?

## Introduction
A minimal Hono server for testing web scraping APIs with various scenarios.
All handlers stay small so you can quickly inspect response patterns and adjust scraping heuristics as needed.

**Features**
- Minimal dependencies: Hono powers routing with `@hono/node-server` for local Node runs.
- No styling: responses are plain text or unstyled HTML to keep scraping behaviour predictable.
- Comprehensive coverage: status codes, content types, redirects, delays, and asset pipelines are all represented.
- Cloudflare Workers ready: the app exports a Hono fetch handler that runs in Workers with `nodejs_compat`.
- 200+ character responses: every textual endpoint returns substantial payloads for realistic scraping tests.

## Endpoints

### Main Page
- `GET /` - HTML index page with direct links to every test endpoint.

### Status Codes
- `GET /status/:code` - Dynamic status code page (supports all HTTP status codes from 100-511).
  - Examples: `/status/200`, `/status/404`, `/status/500`, `/status/301`.

### JavaScript Rendered Content
- `GET /js/inline` - HTML with inline JavaScript rendering (fetch returns minimal HTML).
- `GET /js/external` - HTML with external script file rendering.
- `GET /js/image.png` - HTML with JavaScript that renders an image tag.
- `GET /js/render.js` - Served JavaScript that renders content into the `/js/external` page.

### Special Pages
- `GET /long-response?responseAfter=N` - Response delayed by N seconds (default: 5).
- `GET /duplicates/1` - Duplicate content (version 1).
- `GET /duplicates/2` - Duplicate content (version 2, identical to version 1).
- `GET /redirect/temporary-to-200` - 302 redirect to `/status/200`.
- `GET /redirect/permanent-to-200` - 301 redirect to `/status/200`.
- `GET /headers` - Returns all request headers as plain text.
- `GET /uuid` - Returns a random UUID.
- `GET /random` - Returns random text content.
- `GET /empty` - Returns 204 No Content.

### Content Type Pages
- `GET /markdown` - Content-Type: `text/markdown`.
- `GET /json` - Content-Type: `application/json`.
- `GET /xml` - Content-Type: `application/xml`.
- `GET /html` - Content-Type: `text/html` (unstyled, no CSS).
- `GET /text` - Content-Type: `text/plain`.
- `GET /csv` - Content-Type: `text/csv`.
- `GET /tsv` - Content-Type: `text/tab-separated-values`.

### Forum Pages
- `GET /forum?page=1` - Forum page 1 with dummy messages.
- `GET /forum?page=2` - Forum page 2 with dummy messages.

### Size Pages
- `GET /100Kb` - Configurable path for 100KB content.
- `GET /1Mb` - Configurable path for 1MB content.
- `GET /10Mb` - Configurable path for 10MB content.

### Asset Pages
- `GET /pdf` - Serves PDF file from `public/files/pdf/sample.pdf`.
- `GET /simple.pdf` - Same as `/pdf`.
- `GET /image.png` - Serves PNG image from `public/images/sample.png`.

## Installation

### Setup
```bash
pnpm install
```

### Usage
```bash
# Development mode with auto-reload
pnpm dev

# Production mode
pnpm start
```
The server will start on port 3000 by default. You can change this with the `PORT` environment variable:

```bash
PORT=8080 pnpm start
```

### Configuration

#### External File Paths
For the size-based endpoints (`/100Kb`, `/1Mb`, `/10Mb`), configure external file paths using environment variables:

```bash
PATH_100KB=https://your-storage.com/path/to/100kb-file.txt
PATH_1MB=https://your-storage.com/path/to/1mb-file.txt
PATH_10MB=https://your-storage.com/path/to/10mb-file.txt
```

#### Asset Files
Place your test files in the following directories:

- `public/files/pdf/sample.pdf` - PDF file for `/pdf` and `/simple.pdf` endpoints.
- `public/images/sample.png` - PNG image for `/image.png` endpoint.
- `public/js/render.js` - JavaScript loaded by `/js/external`.

## Cloudflare Workers Deployment

This project is designed with Cloudflare Workers compatibility in mind:

- Uses the Hono fetch handler export instead of Express middleware.
- Avoids Node.js-specific APIs beyond the optional `@hono/node-server` convenience for local runs.
- All routes use standard HTTP methods (`GET`).
- Works with `nodejs_compat` and the `cloudflare` build target.

To deploy to Cloudflare Workers, you'll need to:

1. Use the default export from `src/index.js` as the Worker entry.
2. Configure environment variables for Workers.
3. Keep static files bundled or served from compatible storage when deploying.

## License

MIT
