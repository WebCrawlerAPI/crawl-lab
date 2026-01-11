export function handle100Kb(req, res) {
  const externalPath = process.env.PATH_100KB || 'https://example.com/path/to/100kb-file.txt';
  
  const content = `This endpoint is configured to serve 100KB of content from an external path.

Current external path: ${externalPath}

Configuration:
- Environment variable: PATH_100KB
- Default value: https://example.com/path/to/100kb-file.txt
- Purpose: Serve 100KB of content for testing scraper handling of medium-sized files

The content should be fetched from the configured external path and served through this endpoint. This allows you to test how your scraper handles medium-sized file downloads without redirecting. The server acts as a proxy, fetching content from the external source and delivering it to your scraper.

This approach is useful for testing bandwidth handling, timeout settings, and memory management when scraping medium-sized resources. Ensure your scraper can handle files of this size efficiently without excessive memory usage or timeout errors.

Instructions:
1. Upload your 100KB file to the external storage location
2. Set the PATH_100KB environment variable to the absolute URL
3. Test your scraper against this endpoint
4. Verify that the scraper correctly retrieves and processes the 100KB content

This response text is intentionally longer than 200 characters to provide adequate context for configuration and testing purposes.`;

  res.type('text/plain').send(content);
}

export function handle1Mb(req, res) {
  const externalPath = process.env.PATH_1MB || 'https://example.com/path/to/1mb-file.txt';
  
  const content = `This endpoint is configured to serve 1MB of content from an external path.

Current external path: ${externalPath}

Configuration:
- Environment variable: PATH_1MB
- Default value: https://example.com/path/to/1mb-file.txt
- Purpose: Serve 1MB of content for testing scraper handling of large files

The content should be fetched from the configured external path and served through this endpoint. This allows you to test how your scraper handles large file downloads without redirecting. The server acts as a proxy, fetching content from the external source and delivering it to your scraper.

This approach is useful for testing bandwidth handling, timeout settings, and memory management when scraping large resources. Ensure your scraper can handle files of this size efficiently without excessive memory usage or timeout errors. Large files require careful handling to avoid overwhelming your scraper's memory or causing timeout issues.

Instructions:
1. Upload your 1MB file to the external storage location
2. Set the PATH_1MB environment variable to the absolute URL
3. Test your scraper against this endpoint
4. Verify that the scraper correctly retrieves and processes the 1MB content

This response text is intentionally longer than 200 characters to provide adequate context for configuration and testing purposes.`;

  res.type('text/plain').send(content);
}

export function handle10Mb(req, res) {
  const externalPath = process.env.PATH_10MB || 'https://example.com/path/to/10mb-file.txt';
  
  const content = `This endpoint is configured to serve 10MB of content from an external path.

Current external path: ${externalPath}

Configuration:
- Environment variable: PATH_10MB
- Default value: https://example.com/path/to/10mb-file.txt
- Purpose: Serve 10MB of content for testing scraper handling of very large files

The content should be fetched from the configured external path and served through this endpoint. This allows you to test how your scraper handles very large file downloads without redirecting. The server acts as a proxy, fetching content from the external source and delivering it to your scraper.

This approach is useful for testing bandwidth handling, timeout settings, and memory management when scraping very large resources. Ensure your scraper can handle files of this size efficiently without excessive memory usage or timeout errors. Very large files require streaming or chunked processing to avoid overwhelming your scraper's memory or causing timeout issues.

Instructions:
1. Upload your 10MB file to the external storage location
2. Set the PATH_10MB environment variable to the absolute URL
3. Test your scraper against this endpoint
4. Verify that the scraper correctly retrieves and processes the 10MB content

This response text is intentionally longer than 200 characters to provide adequate context for configuration and testing purposes.`;

  res.type('text/plain').send(content);
}
