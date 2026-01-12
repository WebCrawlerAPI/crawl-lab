export function handleForum(c) {
  const page = Number.parseInt(c.req.query('page') ?? '1', 10) || 1;

  let content = `<!DOCTYPE html>
<html>
<head>
  <title>Forum Page ${page}</title>
</head>
<body>
  <h1>Forum Discussion - Page ${page}</h1>
`;

  if (page === 1) {
    content += `
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
  } else if (page === 2) {
    content += `
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
  } else {
    content += `
  <div class="message">
    <h2>Admin - Posted on Jan 8, 2024</h2>
    <p>This forum page contains messages discussing web scraping techniques, challenges, and solutions. The forum is designed to test scraper API functionality with realistic discussion content. Each message represents a user post with author, date, and substantial content. This page simulates a typical forum discussion thread that scrapers might encounter when crawling discussion boards or community forums.</p>
  </div>
`;
  }

  content += `
  <p>This is a test forum page for scraping API development. The content simulates realistic forum discussions with multiple messages and substantial text content. Each message includes author information, timestamps, and detailed responses to create a realistic scraping scenario. Your scraper should be able to extract individual messages along with their metadata such as author names and posting dates. This content is intentionally lengthy to provide adequate testing data for your scraping API implementation.</p>
</body>
</html>`;

  return c.html(content);
}
