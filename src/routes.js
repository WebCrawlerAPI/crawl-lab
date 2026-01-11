import { handleStatus, statusEntries } from './handlers/status.js';
import { handleMarkdown, handleJson, handleXml, handleHtml, handleText, handleCsv, handleTsv } from './handlers/content.js';
import { handleLongResponse, handleDuplicate1, handleDuplicate2, handleTemporaryRedirect, handlePermanentRedirect, handleHeaders, handleUuid, handleRandom, handleEmpty } from './handlers/special.js';
import { handleJsInline, handleJsExternal, handleJsImage } from './handlers/js.js';
import { handleForum } from './handlers/forum.js';
import { handle100Kb, handle1Mb, handle10Mb } from './handlers/size.js';
import { handlePdf, handleSimplePdf, handleImagePng } from './handlers/assets.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function setupRoutes(app) {
  app.use('/js', express.static(join(__dirname, '../public/js')));
  app.get('/', (req, res) => {
    const statusItems = statusEntries
      .map(([code, name]) => `<li><a href="/status/${code}">${code} ${name}</a></li>`);

    const section = (title, items) => `
      <section>
        <h2>${title}</h2>
        <ul>
          ${items.join('\n')}
        </ul>
      </section>
    `;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Crawl Lab - Scraper Tester Index</title>
</head>
<body>
  <h1>Crawl Lab</h1>
  <p>Scraper Tester API</p>
  ${section('Status Code Pages', statusItems)}
  ${section('JavaScript Rendered Pages', [
    '<li><a href="/js/inline">/js/inline</a> - Inline JavaScript renders the page content</li>',
    '<li><a href="/js/external">/js/external</a> - External JavaScript file renders the page content</li>',
    '<li><a href="/js/image.png">/js/image.png</a> - JavaScript builds an image element dynamically</li>'
  ])}
  ${section('Special Pages', [
    '<li><a href="/long-response?responseAfter=5">/long-response?responseAfter=5</a> - Delayed response after specified seconds</li>',
    '<li><a href="/duplicates/1">/duplicates/1</a> - First duplicate page content</li>',
    '<li><a href="/duplicates/2">/duplicates/2</a> - Second duplicate page (identical content)</li>',
    '<li><a href="/redirect/temporary-to-200">/redirect/temporary-to-200</a> - 302 redirect to /status/200</li>',
    '<li><a href="/redirect/permanent-to-200">/redirect/permanent-to-200</a> - 301 redirect to /status/200</li>',
    '<li><a href="/headers">/headers</a> - Echo request headers</li>',
    '<li><a href="/uuid">/uuid</a> - Random UUID generator</li>',
    '<li><a href="/random">/random</a> - Random text content on every request</li>',
    '<li><a href="/empty">/empty</a> - 204 No Content response</li>'
  ])}
  ${section('Content Type Pages', [
    '<li><a href="/markdown">/markdown</a> - Content-Type: text/markdown</li>',
    '<li><a href="/json">/json</a> - Content-Type: application/json</li>',
    '<li><a href="/xml">/xml</a> - Content-Type: application/xml</li>',
    '<li><a href="/html">/html</a> - Content-Type: text/html (unstyled)</li>',
    '<li><a href="/text">/text</a> - Content-Type: text/plain</li>',
    '<li><a href="/csv">/csv</a> - Content-Type: text/csv</li>',
    '<li><a href="/tsv">/tsv</a> - Content-Type: text/tab-separated-values</li>'
  ])}
  ${section('Forum Pages', [
    '<li><a href="/forum?page=1">/forum?page=1</a> - Forum discussion page 1</li>',
    '<li><a href="/forum?page=2">/forum?page=2</a> - Forum discussion page 2</li>'
  ])}
  ${section('Size Pages', [
    '<li><a href="/100Kb">/100Kb</a> - Proxy instruction for 100KB external file</li>',
    '<li><a href="/1Mb">/1Mb</a> - Proxy instruction for 1MB external file</li>',
    '<li><a href="/10Mb">/10Mb</a> - Proxy instruction for 10MB external file</li>'
  ])}
  ${section('Asset Pages', [
    '<li><a href="/pdf">/pdf</a> - Serve PDF document (public/files/pdf/sample.pdf)</li>',
    '<li><a href="/simple.pdf">/simple.pdf</a> - Alias for /pdf</li>',
    '<li><a href="/image.png">/image.png</a> - Serve PNG image (public/images/sample.png)</li>',
    '<li><a href="/js/image.png">/js/image.png</a> - JavaScript-rendered image page</li>'
  ])}
  <p>All responses aim to provide 200+ characters for scraper validation and have no styling.</p>
</body>
</html>`;

    res.type('text/html').send(html);
  });

  app.get('/status/:code', handleStatus);

  app.get('/js/inline', handleJsInline);
  app.get('/js/external', handleJsExternal);
  app.get('/js/image.png', handleJsImage);

  app.get('/long-response', handleLongResponse);
  app.get('/duplicates/1', handleDuplicate1);
  app.get('/duplicates/2', handleDuplicate2);
  app.get('/redirect/temporary-to-200', handleTemporaryRedirect);
  app.get('/redirect/permanent-to-200', handlePermanentRedirect);
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

  app.get('/100Kb', handle100Kb);
  app.get('/1Mb', handle1Mb);
  app.get('/10Mb', handle10Mb);

  app.get('/pdf', handlePdf);
  app.get('/simple.pdf', handleSimplePdf);
  app.get('/image.png', handleImagePng);

  app.use((req, res) => {
    res.status(404).type('text/plain').send('This is page with 404 status - Page not found. The endpoint you requested does not exist on this server. Please check the main page at / for a list of all available endpoints and their usage. This is a scraper testing API designed to help you test various web scraping scenarios including different HTTP status codes, content types, JavaScript rendering, and more.');
  });
}
