export function handleJsInline(req, res) {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>JS Inline Rendering</title>
</head>
<body>
  <div id="content"></div>
  <script>
    document.getElementById('content').innerHTML = '<h1>Content Rendered with Inline JavaScript</h1><p>This content was rendered by inline JavaScript on the client side. If you fetch this page using a simple HTTP request without JavaScript execution, you will see an empty div with id="content". The actual content is only visible when JavaScript is executed in a browser environment.</p><p>The purpose of this endpoint is to test if your scraper can handle JavaScript-rendered content. Modern websites often use JavaScript to dynamically load content, so it is important that your scraper can execute JavaScript and capture the rendered content.</p><p>This text is longer than 200 characters to provide adequate content for testing purposes and to ensure that your scraper can extract meaningful data from JavaScript-rendered pages.</p>';
  </script>
</body>
</html>`;

  res.type('text/html').send(content);
}

export function handleJsExternal(req, res) {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>JS External Rendering</title>
</head>
<body>
  <div id="content"></div>
  <script src="/js/render.js"></script>
</body>
</html>`;

  res.type('text/html').send(content);
}

export function handleJsImage(req, res) {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>JS Image Rendering</title>
</head>
<body>
  <div id="image-container"></div>
  <script>
    const img = document.createElement('img');
    img.src = '/image.png';
    img.alt = 'JavaScript-rendered image';
    document.getElementById('image-container').appendChild(img);
    const text = document.createElement('p');
    text.textContent = 'This image was rendered dynamically by JavaScript. If you fetch this page without JavaScript execution, you will not see any image. The image tag is created and inserted into the DOM via JavaScript.';
    document.getElementById('image-container').appendChild(text);
  </script>
</body>
</html>`;

  res.type('text/html').send(content);
}
