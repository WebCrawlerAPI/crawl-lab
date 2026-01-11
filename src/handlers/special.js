export function handleLongResponse(req, res) {
  const responseAfter = parseInt(req.query.responseAfter, 10) || 5;
  
  if (responseAfter < 0 || responseAfter > 300) {
    return res.status(400).type('text/plain').send('This is page with 400 status - Invalid responseAfter parameter. Must be between 0 and 300 seconds.');
  }

  setTimeout(() => {
    const content = `This is a long response page that waited ${responseAfter} seconds before responding. The purpose of this endpoint is to test how your scraper handles slow or delayed responses.

Long-response testing is important for:
1. Verifying timeout handling in your scraper
2. Testing resilience to slow servers
3. Checking if your scraper respects timeout settings
4. Ensuring proper error handling for delayed responses

This endpoint accepts a query parameter 'responseAfter' (in seconds) to control how long it waits before sending the response. The default is 5 seconds, but you can customize it for your testing needs. This response text is intentionally longer than 200 characters to provide adequate content for testing purposes.`;

    res.type('text/plain').send(content);
  }, responseAfter * 1000);
}

export function handleDuplicate1(req, res) {
  const content = `This is duplicate content page number 1. Both duplicate/1 and duplicate/2 return exactly the same content to test if your scraper can identify duplicate pages.

The purpose of these duplicate pages is to test deduplication functionality in your scraping system. When scraping websites, you may encounter duplicate content across different URLs. A good scraper should be able to identify and handle these duplicates efficiently.

Duplicate detection can help you:
- Save storage space by avoiding duplicate content
- Improve crawling efficiency by skipping already-visited pages
- Maintain data integrity by avoiding redundant data

This content is the same for both /duplicates/1 and /duplicates/2. Test your scraper to see if it correctly identifies these as duplicate content based on the page body or other metrics. This response is over 200 characters to provide adequate content for testing purposes.`;

  res.type('text/plain').send(content);
}

export function handleDuplicate2(req, res) {
  const content = `This is duplicate content page number 1. Both duplicate/1 and duplicate/2 return exactly the same content to test if your scraper can identify duplicate pages.

The purpose of these duplicate pages is to test deduplication functionality in your scraping system. When scraping websites, you may encounter duplicate content across different URLs. A good scraper should be able to identify and handle these duplicates efficiently.

Duplicate detection can help you:
- Save storage space by avoiding duplicate content
- Improve crawling efficiency by skipping already-visited pages
- Maintain data integrity by avoiding redundant data

This content is the same for both /duplicates/1 and /duplicates/2. Test your scraper to see if it correctly identifies these as duplicate content based on the page body or other metrics. This response is over 200 characters to provide adequate content for testing purposes.`;

  res.type('text/plain').send(content);
}

export function handleTemporaryRedirect(req, res) {
  res.redirect(302, '/status/200');
}

export function handlePermanentRedirect(req, res) {
  res.redirect(301, '/status/200');
}

export function handleHeaders(req, res) {
  const headers = req.headers;
  
  let content = 'Request Headers:\n\n';
  
  for (const [key, value] of Object.entries(headers)) {
    content += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
  }
  
  content += '\n\nThis endpoint returns all the HTTP headers that your scraper sent with the request. This is useful for testing how your scraper handles headers and for debugging header-related issues. Headers contain important metadata about the request including user agent, accept types, authorization, cookies, and more. A good scraper should be able to handle and optionally send custom headers. This response text is intentionally longer than 200 characters to provide adequate context for testing purposes.';

  res.type('text/plain').send(content);
}

export function handleUuid(req, res) {
  const uuid = crypto.randomUUID();
  const content = `This endpoint returns a random UUID (Universally Unique Identifier): ${uuid}

The purpose of this endpoint is to test if your scraper can handle unique, random content that changes on each request. UUIDs are commonly used for:
- Unique identifiers in databases
- Session tokens
- Request tracking
- Distributed systems coordination

Your scraper should be able to extract this UUID value from the response and handle the fact that it will be different on each request. This is important for testing how your scraper handles dynamic content that changes on every page load. This response text is intentionally longer than 200 characters to provide adequate context for testing purposes.`;

  res.type('text/plain').send(content);
}

export function handleRandom(req, res) {
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

  res.type('text/plain').send(content);
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

export function handleEmpty(req, res) {
  res.status(204).set('Content-Length', '0').end();
}
