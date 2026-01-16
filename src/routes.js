import { handleStatus } from './handlers/status.js';
import { handleMarkdown, handleJson, handleXml, handleHtml, handleText, handleCsv, handleTsv } from './handlers/content.js';
import { handleLongResponse, handleDuplicate1, handleDuplicate2, handleTemporaryRedirect, handlePermanentRedirect, handleHeaders, handleUuid, handleRandom, handleEmpty, handleCycleA, handleCycleB } from './handlers/special.js';
import { handleJsInline, handleJsExternal, handleJsImage, handleJsRenderScript } from './handlers/js.js';
import { handleForum, handleForumShop } from './handlers/forum.js';
import { handle100Kb, handle1Mb, handle10Mb } from './handlers/size.js';
import { handlePdf, handleSimplePdf, handleImagePng, handlePublicAssets } from './handlers/assets.js';
import { buildIndexHtml } from './pages/index.js';

export function setupRoutes(app) {
  app.get('/', (c) => c.html(buildIndexHtml()));

  app.get('/js/inline', handleJsInline);
  app.get('/js/external', handleJsExternal);
  app.get('/js/image.png', handleJsImage);
  app.get('/js/render.js', handleJsRenderScript);

  app.get('/long-response', handleLongResponse);
  app.get('/duplicates/1', handleDuplicate1);
  app.get('/duplicates/2', handleDuplicate2);
  app.get('/redirect/temporary-to-200', handleTemporaryRedirect);
  app.get('/redirect/permanent-to-200', handlePermanentRedirect);
  app.get('/redirect/cycle-a', handleCycleA);
  app.get('/redirect/cycle-b', handleCycleB);
  app.get('/headers', handleHeaders);
  app.get('/uuid', handleUuid);
  app.get('/random', handleRandom);
  app.get('/empty', handleEmpty);

  app.get('/markdown', handleMarkdown);
  app.get('/json', handleJson);
  app.get('/xml', handleXml);
  app.get('/html', handleHtml);
  app.get('/text', handleText);
  app.get('/csv', handleCsv);
  app.get('/tsv', handleTsv);

  app.get('/forum', handleForum);
  app.get('/forum/shop/:id', handleForumShop);

  app.get('/100Kb', handle100Kb);
  app.get('/1Mb', handle1Mb);
  app.get('/10Mb', handle10Mb);

  // Static file routes - work in both Node.js and Cloudflare Workers
  app.get('/pdf', handlePdf);
  app.get('/simple.pdf', handleSimplePdf);
  app.get('/image.png', handleImagePng);

  // Public asset paths (for direct access to files in /public directory)
  app.get('/public/*', handlePublicAssets);

  // Status code handler - must be last to avoid conflicting with named routes
  app.get('/:code', handleStatus);

  app.notFound((c) => c.text('This is page with 404 status - Page not found. The endpoint you requested does not exist on this server. Please check the main page at / for a list of all available endpoints and their usage. This is a scraper testing API designed to help you test various web scraping scenarios including different HTTP status codes, content types, JavaScript rendering, and more.', 404));
}
