const statusMessages = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

export const statusEntries = Object.entries(statusMessages);

export function handleStatus(c) {
  const code = Number.parseInt(c.req.param('code'), 10);

  if (!statusMessages[code]) {
    return c.text('This is page with 400 status - Invalid status code provided. Please provide a valid HTTP status code between 100 and 511. This scraper testing API is designed to help you test various web scraping scenarios. Check the main page at / for a list of all available endpoints and their usage.', 400);
  }

  if (code === 101 || code === 204 || code === 205 || code === 304) {
    return c.newResponse(null, { status: code, headers: { 'Content-Length': '0' } });
  }

  const message = `This is page with ${code} status. The HTTP status code ${code} represents "${statusMessages[code]}". This is a scraper testing API endpoint designed to help you test how your web scraping tool handles different HTTP response status codes. You can use this endpoint to verify that your scraper correctly interprets and responds to various HTTP status codes including success codes, redirect codes, client error codes, and server error codes. This response text is intentionally longer than 200 characters to provide adequate content for testing purposes.`;

  return c.text(message, code);
}
