const totalPages = 20;
const shopPages = [1, 2, 3];

const genericTopics = [
  'asynchronous scraping queues and retry logic for transient errors',
  'content extraction approaches when selectors change frequently across releases',
  'legal and ethical considerations when scraping public community posts',
  'monitoring scraper health with dashboards, alerts, and synthetic probes',
  'HTML normalization and text cleanup before storing structured data',
  'pagination handling for forums that mix numbered pages with endless scroll',
  'rate limiting strategies to respect origin servers while staying efficient',
  'storing crawl states so workers can resume after interruptions or crashes',
  'cookie management when sites rotate session tokens after each request',
  'debugging encoding problems when sites serve mixed UTF-8 and legacy charsets'
];

function buildNavigation(page) {
  const links = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return `<li><a href="/forum?page=${pageNumber}">Forum page ${pageNumber}</a></li>`;
  }).join('\n');

  const neighborLinks = `
  <div class="neighbors">
    <p><a href="/forum?page=${page === 1 ? totalPages : page - 1}">Previous page</a> | <a href="/forum?page=${page === totalPages ? 1 : page + 1}">Next page</a></p>
  </div>`;

  const shopLinks = shopPages
    .map((id) => `<li><a href="/forum/shop/${id}">Visit shop page ${id}</a></li>`)
    .join('\n');

  return `
  <nav>
    <h2>Forum Page Directory</h2>
    <ul>
      ${links}
    </ul>
    ${neighborLinks}
    <h3>Shop Discussions</h3>
    <ul>
      ${shopLinks}
    </ul>
  </nav>`;
}

function buildForumExtras(page) {
  const related = [
    page === totalPages ? 1 : page + 1,
    page === 1 ? totalPages : page - 1,
    page + 2 > totalPages ? (page + 2) - totalPages : page + 2
  ];

  const relatedLinks = related
    .map((value) => `<li><a href="/forum?page=${value}">Forum page ${value}</a> - follow-on discussion thread</li>`)
    .join('\n');

  return `
  <section class="highlights">
    <h2>Highlights from adjacent discussions</h2>
    <p>Each linked page expands on this topic with more detailed messages, allowing scrapers to follow cross-page navigation, capture anchor text, and verify page titles stay consistent while the query string changes.</p>
    <ul>
      ${relatedLinks}
    </ul>
  </section>
  <section class="guidelines">
    <h2>Forum formatting and markup guide</h2>
    <p>Posts are wrapped in semantic sections, lists, and paragraphs so scraper clients can test how they parse nested HTML without CSS. Look for headings, descriptive anchor labels, and consistent structures that repeat across all twenty pages.</p>
    <p>Remember to verify that each link preserves the <code>?page=</code> query parameter, that titles reflect the current page number, and that text content remains plentiful for density checks.</p>
  </section>`;
}

function buildPageContent(page) {
  if (page === 1) {
    return `
  <div class="message">
    <h2>User123 - Posted on Jan 10, 2024</h2>
    <p>Hello everyone! I've been working on a web scraping project and I'm having some trouble with JavaScript-rendered content. Has anyone successfully scraped sites that use client-side rendering? I've tried several approaches but none seem to work reliably. Any suggestions would be greatly appreciated as I'm stuck on this issue for quite some time now.</p>
  </div>

  <div class="message">
    <h2>ScraperExpert - Posted on Jan 10, 2024</h2>
    <p>Yes, JavaScript rendering can be challenging. I recommend using a headless browser like Puppeteer or Playwright. These tools execute JavaScript in a real browser environment, so you can capture the rendered content. It's slower than simple HTTP requests but necessary for modern SPA sites. Make sure to handle timeouts and manage browser instances properly to avoid memory leaks in your scraping process.</p>
  </div>

  <div class="message">
    <h2>WebDevPro - Posted on Jan 10, 2024</h2>
    <p>I agree with Puppeteer, but also consider using browser automation frameworks like Selenium if you need cross-browser compatibility. Another option is to reverse-engineer the API calls that the JavaScript makes. Sometimes the data is available via AJAX or GraphQL endpoints that you can call directly without rendering the entire page. This approach is much faster and more resource-efficient if you can figure out the API structure.</p>
  </div>
`;
  }

  if (page === 2) {
    return `
  <div class="message">
    <h2>DataMiner - Posted on Jan 9, 2024</h2>
    <p>Great question about API reverse engineering. I've found that using browser developer tools' Network tab is invaluable for this. You can see all the XHR/fetch requests and their responses. Many modern sites fetch data via REST APIs or GraphQL, and sometimes you can call these APIs directly with proper headers. This approach saves enormous resources compared to rendering the entire page just to extract data.</p>
  </div>

  <div class="message">
    <h2>ScrapingNewbie - Posted on Jan 9, 2024</h2>
    <p>That's a great point! I never thought about looking at the Network tab. Do you have any tips on which requests to look for? Sometimes there are dozens of requests and it's hard to figure out which one contains the data I need. Also, some sites have anti-scraping measures that detect automated requests. How do you handle those challenges when scraping modern websites?</p>
  </div>

  <div class="message">
    <h2>CrawlerKing - Posted on Jan 9, 2024</h2>
    <p>When analyzing network requests, focus on XHR and fetch requests, especially those returning JSON. Look for patterns in the URL structure and response payloads. Regarding anti-scraping, rotating user agents, using residential proxies, and implementing delays between requests are common strategies. Some sites also use CAPTCHAs or require JavaScript execution for verification. For those, you might need to use CAPTCHA solving services or accept that some sites are too difficult to scrape at scale without getting blocked.</p>
  </div>
`;
  }

  const topic = genericTopics[(page - 3) % genericTopics.length];
  const emphasis = 'This forum page exists so scrapers can navigate numbered pages, follow internal links, and harvest structured text without surprises. Each page is unique but predictable, making it a reliable target for validating pagination logic, link discovery, and content extraction rules.';

  return `
  <div class="message">
    <h2>Admin - Page ${page} Recap</h2>
    <p>This forum page contains messages discussing ${topic}. Contributors describe lessons learned when building resilient crawlers, how they debug live outages, and the importance of monitoring latency. ${emphasis}</p>
  </div>

  <div class="message">
    <h2>Moderator - Navigation Note</h2>
    <p>Use the directory links to jump between pages and the neighbor controls to move one step forward or backward. Crawlers should confirm the anchor tags resolve correctly and that query parameters remain intact while traversing pages. The content stays verbose to help with text density checks.</p>
  </div>
`;
}

export function handleForum(c) {
  const rawPage = Number.parseInt(c.req.query('page') ?? '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, totalPages) : 1;

  let content = `<!DOCTYPE html>
<html>
<head>
  <title>Forum Page ${page}</title>
</head>
<body>
  <h1>Forum Discussion - Page ${page}</h1>
`;

  content += buildPageContent(page);
  content += `
  <section class="overview">
    <h2>Forum purpose</h2>
    <p>This is a test forum page for scraping API development. The content simulates realistic forum discussions with multiple messages and substantial text content. Each message includes author information, timestamps, and detailed responses to create a realistic scraping scenario. Your scraper should be able to extract individual messages along with their metadata such as author names and posting dates. This content is intentionally lengthy to provide adequate testing data for your scraping API implementation.</p>
    <p>Beyond the main messages, every page offers navigation lists, footers, and repeated structures so crawlers can validate link discovery, pagination traversal, and extraction of headings, paragraphs, and lists without relying on CSS.</p>
  </section>
  ${buildForumExtras(page)}
  ${buildNavigation(page)}
  <footer>
    <p>Footer for page ${page} referencing <a href="/forum?page=1">start of the thread</a> and <a href="/forum?page=${totalPages}">last page</a>. This footer remains verbose to maintain density for scraping experiments.</p>
  </footer>
</body>
</html>`;

  return c.html(content);
}

export function handleForumShop(c) {
  const rawId = Number.parseInt(c.req.param('id') ?? '1', 10);
  const id = Number.isFinite(rawId) && rawId > 0 ? Math.min(rawId, shopPages.length) : 1;

  const crossLinks = shopPages
    .map((pageId) => `<li><a href="/forum/shop/${pageId}">Shop discussion ${pageId}</a></li>`)
    .join('\n');

  const forumLinks = Array.from({ length: totalPages }, (_, index) => `<li><a href="/forum?page=${index + 1}">Forum page ${index + 1}</a></li>`).join('\n');

  const body = `<!DOCTYPE html>
<html>
<head>
  <title>Forum Shop Page ${id}</title>
</head>
<body>
  <h1>Book Shop Discussion - Page ${id}</h1>
  <article class="shop-story">
    <h2>BookSeller${id} - Posted on Jan 11, 2024</h2>
    <p>This shop thread focuses on curated book listings that forum members discuss and trade. Each shop page links back to every forum page so crawler link discovery stays rich and deterministic. Listings include long descriptions about genre, condition, edition notes, pricing expectations, availability, and shipping behaviors. Scrapers should follow links in both directions and verify pagination is intact while handling abundant prose.</p>
    <p>Highlighted items include classic programming texts, scraping cookbooks, and reference manuals. Anchor tags appear near descriptive phrases to ensure parsers encounter realistic markup density without extraneous assets or scripts.</p>
  </article>
  <div class="navigation">
    <h3>Other Book Shop Threads</h3>
    <ul>
      ${crossLinks}
    </ul>
    <h3>Forum Threads</h3>
    <ul>
      ${forumLinks}
    </ul>
    <p><a href="/forum/shop/${id === 1 ? shopPages.length : id - 1}">Previous shop page</a> | <a href="/forum/shop/${id === shopPages.length ? 1 : id + 1}">Next shop page</a></p>
    <p><a href="/forum?page=${id}">Visit matching forum page ${id}</a></p>
  </div>
</body>
</html>`;

  return c.html(body);
}
