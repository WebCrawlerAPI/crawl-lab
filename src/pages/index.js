import { statusEntries } from '../handlers/status.js';

const section = (title, items) => `
  <section>
    <h2>${title}</h2>
    <ul>
      ${items.join('\n')}
    </ul>
  </section>
`;

export function buildIndexHtml() {
  const statusItems = statusEntries
    .map(([code, name]) => `<li><a href="/status/${code}">${code} ${name}</a></li>`);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Crawl Lab - Scraper Tester Index</title>
</head>
<body>
  <h1>Crawl Lab</h1>
  Toolkit to make your crawlers and scrapers suffer 😈 
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
    '<li><a href="/redirect/cycle-a">/redirect/cycle-a</a> - 302 redirect to cycle-b (infinite cycle A → B → A)</li>',
    '<li><a href="/redirect/cycle-b">/redirect/cycle-b</a> - 302 redirect to cycle-a (infinite cycle B → A → B)</li>',
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
  This project is open source on <a href=https://github.com/webcrawlerapi/crawl-lab>Github</>
</body>
</html>`;
}
