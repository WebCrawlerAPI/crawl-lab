export function handleMarkdown(req, res) {
  const content = `# Markdown Content Page

This is a markdown-formatted document for testing scraper API content type handling.

## Headers
- Header level 1: Main topic
- Header level 2: Subtopic
- Header level 3: Detail

## Lists
Unordered list items for testing:
- First item in the list
- Second item with some more text
- Third item that completes the list

## Code Blocks
\`\`\`javascript
const example = "This is a code block for testing";
console.log(example);
\`\`\`

## Links and Formatting
This paragraph contains **bold text**, *italic text*, and \`inline code\`. The purpose of this markdown document is to provide a substantial amount of markdown-formatted content (well over 200 characters) for testing scraper APIs that need to parse and understand markdown content types correctly.`;

  res.type('text/markdown').send(content);
}

export function handleJson(req, res) {
  const content = {
    message: "This is a JSON response for testing scraper API content type handling",
    status: "success",
    data: {
      title: "JSON Content Page",
      description: "This endpoint returns a properly formatted JSON response with application/json content type header",
      items: [
        "First item in the array",
        "Second item with additional details",
        "Third item that completes the example"
      ],
      metadata: {
        created: "2024-01-11",
        version: "1.0.0",
        purpose: "Testing JSON content type parsing"
      }
    },
    details: "The JSON content is designed to be substantial enough (over 200 characters) to test real-world scraper scenarios. JSON is a common data format used by many APIs and web applications, so it's important that your scraper can handle it correctly. This response includes nested objects, arrays, and various data types."
  };
  
  res.type('application/json').json(content);
}

export function handleXml(req, res) {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <message>This is an XML response for testing scraper API content type handling</message>
  <status>success</status>
  <data>
    <title>XML Content Page</title>
    <description>This endpoint returns a properly formatted XML response with application/xml content type header</description>
    <items>
      <item>First item in the list</item>
      <item>Second item with additional details</item>
      <item>Third item that completes the example</item>
    </items>
  </data>
  <metadata>
    <created>2024-01-11</created>
    <version>1.0.0</version>
    <purpose>Testing XML content type parsing</purpose>
  </metadata>
  <details>The XML content is designed to be substantial enough (over 200 characters) to test real-world scraper scenarios. XML is a common data format used by many APIs and web applications, so it's important that your scraper can handle it correctly. This response includes nested elements, attributes, and various data types for comprehensive testing.</details>
</response>`;

  res.type('application/xml').send(content);
}

export function handleHtml(req, res) {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>HTML Content Page</title>
</head>
<body>
  <h1>HTML Content Page</h1>
  <p>This is an HTML response for testing scraper API content type handling. The endpoint returns properly formatted HTML content with text/html content type header.</p>
  <h2>Content Sections</h2>
  <p>This paragraph contains regular text without any styling or CSS. The purpose is to test how your scraper handles HTML content without the complexity of styles.</p>
  <h3>Lists</h3>
  <ul>
    <li>First item in the unordered list</li>
    <li>Second item with additional details</li>
    <li>Third item that completes the example</li>
  </ul>
  <h3>Paragraphs</h3>
  <p>This is another paragraph with more content. The HTML content is designed to be substantial enough (over 200 characters) to test real-world scraper scenarios. HTML is the most common format for web pages, so it's important that your scraper can handle it correctly. This response includes various HTML elements like headings, paragraphs, and lists.</p>
  <p>This final paragraph ensures we have adequate content length for comprehensive testing purposes.</p>
</body>
</html>`;

  res.type('text/html').send(content);
}

export function handleText(req, res) {
  const content = `This is a plain text response for testing scraper API content type handling. The endpoint returns plain text content with text/plain content type header.

The purpose of this endpoint is to test how your scraper handles simple plain text responses without any formatting or structure. Plain text is one of the simplest content types, but it's still important to handle correctly.

This content is designed to be substantial enough (over 200 characters) to test real-world scraper scenarios. Plain text responses are commonly used for simple APIs, configuration files, and other basic data exchange formats.

Your scraper should be able to extract this text content and handle it appropriately without attempting to parse it as JSON, XML, HTML, or any other structured format. The text/plain content type indicates that this is unstructured text data.`;

  res.type('text/plain').send(content);
}

export function handleCsv(req, res) {
  const content = `id,name,description,quantity,price
1,First Item,This is the first item in the CSV dataset,10,19.99
2,Second Item,This item has more details about product,5,29.99
3,Third Item,Another product description here,15,9.99
4,Fourth Item,Additional item for testing CSV parsing,8,49.99
5,Fifth Item,Final item to complete the dataset,3,39.99

This CSV file is designed to test scraper API content type handling. It includes multiple rows and columns with various data types including integers, decimals, and text strings. The CSV format uses comma-separated values which is a common data interchange format. Your scraper should be able to parse this CSV content correctly when it encounters the text/csv content type header. This description row and additional text ensure the content is over 200 characters for comprehensive testing purposes.`;

  res.type('text/csv').send(content);
}

export function handleTsv(req, res) {
  const content = `id\tname\tdescription\tquantity\tprice
1\tFirst Item\tThis is the first item in the TSV dataset\t10\t19.99
2\tSecond Item\tThis item has more details about product\t5\t29.99
3\tThird Item\tAnother product description here\t15\t9.99
4\tFourth Item\tAdditional item for testing TSV parsing\t8\t49.99
5\tFifth Item\tFinal item to complete the dataset\t3\t39.99

This TSV file is designed to test scraper API content type handling. It includes multiple rows and columns with various data types including integers, decimals, and text strings. The TSV format uses tab-separated values which is another common data interchange format. Your scraper should be able to parse this TSV content correctly when it encounters the text/tab-separated-values content type header. This description row and additional text ensure the content is over 200 characters for comprehensive testing purposes.`;

  res.type('text/tab-separated-values').send(content);
}
