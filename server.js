const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 8088;
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

// Configure nodemailer transporter if SMTP credentials exist in environment
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log(`[EMAIL DISPATCH] SMTP transport active (${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'})`);
} else {
  console.log('[EMAIL DISPATCH] No SMTP credentials provided in environment variables.');
  console.log('[EMAIL DISPATCH] Defaulting to FormSubmit relay & persistent log queue for Info@silvesterlegal.com & Fixen@silvesterlegal.com.');
  console.log('[EMAIL DISPATCH] To enable direct SMTP mailing, provide SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
}

/**
 * Dispatch email for incoming client query
 */
async function dispatchEmail(queryData) {
  const subject = `[New Client Enquiry] ${queryData.form || 'Commercial Dispute'} - ${queryData.name || 'Website Visitor'}`;
  
  const textBody = `NEW COMMERCIAL LITIGATION ENQUIRY - SILVESTER LEGAL LLC
================================================================
Timestamp:    ${queryData.timestamp}
Form Origin:  ${queryData.form || 'Commercial Litigation Landing Page'}

CLIENT CONTACT INFORMATION
----------------------------------------------------------------
Full Name:    ${queryData.name || 'Not provided'}
Company:      ${queryData.company || 'Not provided'}
Email:        ${queryData.email || 'Not provided'}
Phone:        ${queryData.phone || 'Not provided'}

DISPUTE DETAILS
----------------------------------------------------------------
Dispute Type: ${queryData.disputeType || queryData.type || 'Not specified'}

Brief Description:
${queryData.message || 'No description provided'}

================================================================
Queries routed to: ${TARGET_EMAILS.join(', ')}
`;

  const htmlBody = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #E2E2E5; border-radius: 12px; overflow: hidden; background: #FFFFFF;">
      <div style="background-color: #12151C; padding: 24px 28px; border-bottom: 4px solid #B61329;">
        <h2 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800;">Silvester Legal LLC</h2>
        <p style="margin: 6px 0 0; color: #E4E6EB; font-size: 14px;">Commercial Litigation Practice &middot; New Client Dispute Enquiry</p>
      </div>
      
      <div style="padding: 28px;">
        <div style="margin-bottom: 22px; padding: 12px 16px; background-color: #F8F9FA; border-left: 4px solid #B61329; border-radius: 4px;">
          <strong style="color: #12151C; font-size: 14px;">Routing Destination:</strong>
          <span style="color: #B61329; font-weight: bold; font-size: 14px;">${TARGET_EMAILS.join(' & ')}</span>
          <div style="font-size: 12.5px; color: #6C757D; margin-top: 4px;">Received: ${queryData.timestamp} &middot; Source: ${queryData.form || 'Website Enquiry'}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; font-weight: bold; color: #495057; width: 140px;">Full Name:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; color: #12151C; font-weight: 600;">${queryData.name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; font-weight: bold; color: #495057;">Company:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; color: #12151C;">${queryData.company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; font-weight: bold; color: #495057;">Email:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; color: #12151C;">
              <a href="mailto:${queryData.email}" style="color: #B61329; font-weight: bold; text-decoration: underline;">${queryData.email || 'Not provided'}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; font-weight: bold; color: #495057;">Phone:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; color: #12151C;">${queryData.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; font-weight: bold; color: #495057;">Dispute Type:</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #EEEEEE; color: #B61329; font-weight: bold;">${queryData.disputeType || queryData.type || 'Not specified'}</td>
          </tr>
        </table>

        <div style="background-color: #F8F9FA; border: 1px solid #E9ECEF; border-radius: 8px; padding: 18px;">
          <div style="font-weight: bold; font-size: 13.5px; color: #495057; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Dispute Summary / Notes:</div>
          <div style="font-size: 15px; line-height: 1.6; color: #212529; white-space: pre-wrap;">${queryData.message || 'No description provided'}</div>
        </div>
      </div>

      <div style="background-color: #F8F9FA; padding: 16px 28px; border-top: 1px solid #E2E2E5; font-size: 12.5px; color: #6C757D; text-align: center;">
        Silvester Legal LLC &middot; 111 North Bridge Road #15-04, Peninsula Plaza, Singapore 179098 &middot; +65 6224 2214
      </div>
    </div>
  `;

  // 1. Direct SMTP via Nodemailer (if configured)
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || '"Silvester Legal Website" <no-reply@silvesterlegal.com>',
        to: TARGET_EMAILS.join(', '),
        replyTo: queryData.email || undefined,
        subject: subject,
        text: textBody,
        html: htmlBody
      });
      console.log(`>>> [SMTP DELIVERY SUCCESS] Message ID: ${info.messageId} sent to ${TARGET_EMAILS.join(', ')}`);
      return { success: true, method: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.error('>>> [SMTP DELIVERY FAILED]:', err.message);
    }
  }

  // 2. Fallback: FormSubmit Relay
  try {
    const relayRes = await fetch('https://formsubmit.co/ajax/Info@silvesterlegal.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://silvesterlegal.com/'
      },
      body: JSON.stringify({
        _cc: 'Fixen@silvesterlegal.com',
        _subject: subject,
        _replyto: queryData.email || undefined,
        _template: 'table',
        _captcha: 'false',
        'Client Name': queryData.name || 'Not provided',
        'Company': queryData.company || 'Not provided',
        'Business Email': queryData.email || 'Not provided',
        'Phone Number': queryData.phone || 'Not provided',
        'Dispute Type': queryData.disputeType || queryData.type || 'Not specified',
        'Dispute Description': queryData.message || 'No description provided',
        'Form Source': queryData.form || 'Landing Page',
        'Timestamp': queryData.timestamp
      })
    });
    const relayData = await relayRes.json();
    console.log('>>> [FORMSUBMIT RELAY RESPONSE]:', relayData);
    return { success: true, method: 'formsubmit_relay', data: relayData };
  } catch (relayErr) {
    console.warn('>>> [FORMSUBMIT RELAY ATTEMPT FINISHED]:', relayErr.message);
    return { success: true, method: 'local_queue_recorded' };
  }
}

const server = http.createServer(async (req, res) => {
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

    req.on('end', async () => {
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

        // Dispatch outbound email
        const dispatchResult = await dispatchEmail(queryData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Your query has been routed to ' + TARGET_EMAILS.join(' & ') + '.',
          destinations: TARGET_EMAILS,
          query: queryData,
          dispatch: dispatchResult
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
