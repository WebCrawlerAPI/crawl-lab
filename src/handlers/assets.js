// R2 file paths
const PDF_FILE_PATH = 'assets/sample.pdf';
const PNG_FILE_PATH = 'assets/sample.png';

// Detect environment once
const isLocalEnv = typeof process !== 'undefined' && process.env.NODE_ENV !== 'local';

async function loadFromLocalFileSystem(localRelativePath, contentType, filename, c) {
  // Node.js or fallback: dynamically import fs modules
  const { readFile } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fullPath = join(__dirname, localRelativePath);
  const body = await readFile(fullPath);

  const headers = {
    'Content-Type': contentType,
    'Content-Length': String(body.byteLength)
  };

  if (filename) {
    headers['Content-Disposition'] = `inline; filename="${filename}"`;
  }

  return c.newResponse(body, { status: 200, headers });
}

async function loadStaticFile(c, r2Key, localRelativePath, contentType, filename) {
  try {
    // Check if running in Cloudflare Workers environment
    if (!isLocalEnv) {
      // Cloudflare Workers: use R2 bucket only
      const bucket = c.env.ASSETS_BUCKET;

      if (!bucket) {
        return c.text('R2 bucket not configured. Please set up ASSETS_BUCKET binding in wrangler.toml', 500);
      }

      // Fetch object from R2
      const object = await bucket.get(r2Key);

      if (!object) {
        return c.text(`File not found in R2: ${r2Key}`, 404);
      }

      // Prepare headers
      const headers = {
        'Content-Type': contentType,
        'Content-Length': String(object.size),
        'ETag': object.httpEtag,
      };

      if (filename) {
        headers['Content-Disposition'] = `inline; filename="${filename}"`;
      }

      // Return response with R2 object body
      return new Response(object.body, {
        status: 200,
        headers,
      });
    } else {
      // Node.js: use local file system
      return await loadFromLocalFileSystem(localRelativePath, contentType, filename, c);
    }
  } catch (error) {
    console.error('[assets] File load error:', error.message);
    return c.text(`Error loading file: ${error.message}`, 500);
  }
}

export async function handlePdf(c) {
  return loadStaticFile(c, PDF_FILE_PATH, '../../public/files/pdf/sample.pdf', 'application/pdf', 'sample.pdf');
}

export async function handleSimplePdf(c) {
  return loadStaticFile(c, PDF_FILE_PATH, '../../public/files/pdf/sample.pdf', 'application/pdf', 'sample.pdf');
}

export async function handleImagePng(c) {
  return loadStaticFile(c, PNG_FILE_PATH, '../../public/images/sample.png', 'image/png', 'sample.png');
}

export async function handlePublicAssets(c) {
  try {
    if (!isLocalEnv) {
      // Cloudflare Workers: use R2 bucket
      const bucket = c.env.ASSETS_BUCKET;

      if (!bucket) {
        return c.text('R2 bucket not configured', 500);
      }

      // Strip '/public' prefix from the URL path and construct R2 key
      const originalPath = new URL(c.req.url).pathname;
      const pathWithoutPublic = originalPath.replace(/^\/public\//, '');

      // Construct R2 key - assuming files are in 'assets/' prefix in R2
      const r2Key = `assets/${pathWithoutPublic}`;

      // Fetch object from R2
      const object = await bucket.get(r2Key);

      if (!object) {
        return c.text('Not found', 404);
      }

      // Determine content type from file extension
      const contentType = object.httpMetadata?.contentType || 'application/octet-stream';

      // Return response with R2 object body
      return new Response(object.body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(object.size),
          'ETag': object.httpEtag,
        },
      });
    }

    // Node.js: return 404
    return c.text('Not found', 404);
  } catch (error) {
    console.error('[assets] Public asset error:', error.message);
    return c.text('Not found', 404);
  }
}
