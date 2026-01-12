import { fileURLToPath } from 'node:url';
import { buildApp } from './app.js';

const app = buildApp();

async function startNodeServer() {
  if (typeof process === 'undefined' || process.release?.name !== 'node') {
    return;
  }

  const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

  if (!isMainModule) {
    return;
  }

  const { serve } = await import('@hono/node-server');
  const port = Number.parseInt(process.env.PORT ?? '3000', 10) || 3000;

  console.log(`Crawl Lab is running at http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}

startNodeServer();

export default app;
