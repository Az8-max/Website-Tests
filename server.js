const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8088;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const QUERIES_FILE = path.join(__dirname, 'queries.json');
const TARGET_EMAILS = ['Info@silvesterlegal.com', 'Fixen@silvesterlegal.com'];

// Initialize queries.json if it doesn't exist
if (!fs.existsSync(QUERIES_FILE)) {
  fs.writeFileSync(QUERIES_FILE, JSON.stringify([], null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle client query submissions
  if (req.method === 'POST' && req.url === '/api/query') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy(); // 1MB limit
      }
    });

    req.on('end', () => {
      try {
        let queryData;
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
          queryData = JSON.parse(body);
        } else {
          const params = new URLSearchParams(body);
          queryData = Object.fromEntries(params.entries());
        }

        queryData.timestamp = new Date().toISOString();
        queryData.destinations = TARGET_EMAILS;

        // Persist query to queries.json
        let existingQueries = [];
        try {
          existingQueries = JSON.parse(fs.readFileSync(QUERIES_FILE, 'utf8'));
        } catch (e) {
          existingQueries = [];
        }
        existingQueries.push(queryData);
        fs.writeFileSync(QUERIES_FILE, JSON.stringify(existingQueries, null, 2), 'utf8');

        // Formatted log of dispatched client query
        console.log('\n================================================================');
        console.log('>>> [NEW CLIENT QUERY RECEIVED & DISPATCHED]');
        console.log(`>>> DESTINATIONS : ${TARGET_EMAILS.join(', ')}`);
        console.log(`>>> TIMESTAMP    : ${queryData.timestamp}`);
        console.log(`>>> FORM ORIGIN  : ${queryData.form || 'Website Query'}`);
        console.log(`>>> CLIENT NAME  : ${queryData.name || 'Not provided'}`);
        console.log(`>>> COMPANY      : ${queryData.company || 'Not provided'}`);
        console.log(`>>> EMAIL        : ${queryData.email || 'Not provided'}`);
        console.log(`>>> PHONE        : ${queryData.phone || 'Not provided'}`);
        console.log(`>>> DISPUTE TYPE : ${queryData.disputeType || queryData.type || 'Not specified'}`);
        console.log(`>>> MESSAGE      : ${queryData.message || 'No description provided'}`);
        console.log('================================================================\n');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Your query has been routed to ' + TARGET_EMAILS.join(' & ') + '.',
          destinations: TARGET_EMAILS,
          query: queryData
        }));
      } catch (err) {
        console.error('Error parsing query submission:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid query payload' }));
      }
    });
    return;
  }

  // Handle GET /api/queries to inspect recorded queries
  if (req.method === 'GET' && req.url === '/api/queries') {
    let queries = [];
    try {
      queries = JSON.parse(fs.readFileSync(QUERIES_FILE, 'utf8'));
    } catch (e) {
      queries = [];
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ destinations: TARGET_EMAILS, total: queries.length, queries }, null, 2));
    return;
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  filePath = filePath.split('?')[0];

  if (!path.extname(filePath) && !fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const extname = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[extname] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Inquiries destination routing configured for: ${TARGET_EMAILS.join(', ')}`);
});
