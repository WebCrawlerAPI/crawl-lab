export async function handleLongResponsePath(c) {
  const raw = c.req.param('seconds') ?? '5s';
  const responseAfter = Number.parseInt(raw, 10) || 5;
  return handleLongResponseWithDelay(c, responseAfter);
}

export async function handleLongResponse(c) {
  const responseAfter = Number.parseInt(c.req.query('responseAfter') ?? '5', 10) || 5;
  return handleLongResponseWithDelay(c, responseAfter);
}

async function handleLongResponseWithDelay(c, responseAfter) {

  if (responseAfter < 0 || responseAfter > 300) {
    return c.text('This is page with 400 status - Invalid responseAfter parameter. Must be between 0 and 300 seconds.', 400);
  }

  await new Promise((resolve) => setTimeout(resolve, responseAfter * 1000));

  const content = `This is a long response page that waited ${responseAfter} seconds before responding. The purpose of this endpoint is to test how your scraper handles slow or delayed responses.

Long-response testing is important for:
1. Verifying timeout handling in your scraper
2. Testing resilience to slow servers
3. Checking if your scraper respects timeout settings
4. Ensuring proper error handling for delayed responses

This endpoint accepts a query parameter 'responseAfter' (in seconds) to control how long it waits before sending the response. The default is 5 seconds, but you can customize it for your testing needs. This response text is intentionally longer than 200 characters to provide adequate content for testing purposes.`;

  return c.text(content);
}

export function handleDuplicate1(c) {
  const content = `This is duplicate content page number 1. Both duplicate/1 and duplicate/2 return exactly the same content to test if your scraper can identify duplicate pages.

The purpose of these duplicate pages is to test deduplication functionality in your scraping system. When scraping websites, you may encounter duplicate content across different URLs. A good scraper should be able to identify and handle these duplicates efficiently.

Duplicate detection can help you:
- Save storage space by avoiding duplicate content
- Improve crawling efficiency by skipping already-visited pages
- Maintain data integrity by avoiding redundant data

This content is the same for both /duplicates/1 and /duplicates/2. Test your scraper to see if it correctly identifies these as duplicate content based on the page body or other metrics. This response is over 200 characters to provide adequate content for testing purposes.`;

  return c.text(content);
}

export function handleDuplicate2(c) {
  const content = `This is duplicate content page number 1. Both duplicate/1 and duplicate/2 return exactly the same content to test if your scraper can identify duplicate pages.

The purpose of these duplicate pages is to test deduplication functionality in your scraping system. When scraping websites, you may encounter duplicate content across different URLs. A good scraper should be able to identify and handle these duplicates efficiently.

Duplicate detection can help you:
- Save storage space by avoiding duplicate content
- Improve crawling efficiency by skipping already-visited pages
- Maintain data integrity by avoiding redundant data

This content is the same for both /duplicates/1 and /duplicates/2. Test your scraper to see if it correctly identifies these as duplicate content based on the page body or other metrics. This response is over 200 characters to provide adequate content for testing purposes.`;

  return c.text(content);
}

export function handleTemporaryRedirect(c) {
  return c.redirect('/200', 302);
}

export function handlePermanentRedirect(c) {
  return c.redirect('/200', 301);
}

export function handleHeaders(c) {
  const headers = Array.from(c.req.raw.headers.entries());

  let content = 'Request Headers:\n\n';

  for (const [key, value] of headers) {
    content += `${key}: ${value}\n`;
  }

  content += '\n\nThis endpoint returns all the HTTP headers that your scraper sent with the request. This is useful for testing how your scraper handles headers and for debugging header-related issues. Headers contain important metadata about the request including user agent, accept types, authorization, cookies, and more. A good scraper should be able to handle and optionally send custom headers. This response text is intentionally longer than 200 characters to provide adequate context for testing purposes.';

  return c.text(content);
}

export function handleUuid(c) {
  const uuid = crypto.randomUUID();
  const content = `${uuid}`;

  return c.text(content);
}

export function handleRandom(c) {
  const randomText = generateRandomText(300);
  const content = `This endpoint returns random content that changes on each request.

Random Content:
${randomText}

The purpose of this endpoint is to test how your scraper handles dynamic content that changes on every request. Random content presents challenges for scraping because:
- The content is never the same twice
- Caching strategies may not work effectively
- Data validation becomes more complex
- Testing requires understanding of the random nature

Your scraper should be able to handle random content appropriately, understanding that the content will vary between requests. This response text is intentionally longer than 200 characters to provide adequate context for testing purposes.`;

  return c.text(content);
}

function generateRandomText(length) {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'];
  let text = '';
  
  while (text.length < length) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (text.length > 0) text += ' ';
    text += randomWord;
  }
  
  return text;
}

export function handleEmpty(c) {
  return c.newResponse(null, {
    status: 200,
    headers: { 'Content-Length': '0' },
  });
}

export function handleCycleA(c) {
  return c.redirect('/redirect/cycle-b', 302);
}

export function handleCycleB(c) {
  return c.redirect('/redirect/cycle-a', 302);
}
