const fs = require('fs');
let html = fs.readFileSync('thank-you.html', 'utf8');
const headerEnd = html.indexOf('</header>') + '</header>'.length;
const footerStart = html.indexOf('<footer class="site-footer">');
const thankYouSection = `
    <!-- Thank You Section -->
    <section class="hero" style="min-height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center;">
      <div class="container hero-grid" style="grid-template-columns: 1fr;">
        <div class="hero-content" style="max-width: 800px; margin: 0 auto;">
          <h1>Thank You.<br/><span>We will get back to you.</span></h1>
          <p style="max-width: 100%;">Your query has been successfully submitted. One of our litigation specialists will review your case and contact you within 24 hours.</p>
          <div style="margin-top: 40px;">
            <a href="index.html" class="btn btn-primary" style="font-size: 1.1rem; padding: 14px 32px;">&larr; Return to Homepage</a>
          </div>
        </div>
      </div>
    </section>
`;
const newHtml = html.substring(0, headerEnd) + thankYouSection + html.substring(footerStart);
fs.writeFileSync('thank-you.html', newHtml);
