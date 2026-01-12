// R2 file paths for size test files
const FILE_100KB_PATH = 'assets/100kb.txt';
const FILE_1MB_PATH = 'assets/1mb.txt';
const FILE_10MB_PATH = 'assets/10mb.txt';

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
    console.error('[size] File load error:', error.message);
    return c.text(`Error loading file: ${error.message}`, 500);
  }
}

export async function handle100Kb(c) {
  return loadStaticFile(c, FILE_100KB_PATH, '../../public/files/100kb.txt', 'text/plain', '100kb.txt');
}

export async function handle1Mb(c) {
  return loadStaticFile(c, FILE_1MB_PATH, '../../public/files/1mb.txt', 'text/plain', '1mb.txt');
}

export async function handle10Mb(c) {
  return loadStaticFile(c, FILE_10MB_PATH, '../../public/files/10mb.txt', 'text/plain', '10mb.txt');
}
