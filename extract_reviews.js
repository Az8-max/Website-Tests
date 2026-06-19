const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://silvesterlegal.com/', { waitUntil: 'networkidle2' });

  // Wait for the reviews widget to load (it might take a few seconds)
  await new Promise(resolve => setTimeout(resolve, 5000));

  // The reviews are often inside an iframe or shadow DOM if it's a widget
  // Let's dump all text to see if we can find it
  const bodyText = await page.evaluate(() => document.body.innerText);
  
  if (bodyText.includes('Leanne Teo') || bodyText.includes('Akesh Abhilash')) {
      console.log("Found reviews in main DOM. Extracting...");
      // Try to extract if it's in the main DOM
      const reviews = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll('.elfsight-app-* .eapps-google-reviews-item, .trustindex-widget .ti-review-item')); // Guesses for common widgets
          return cards.map(c => c.innerText);
      });
      console.log("Extracted cards:", reviews.length);
      console.log(reviews);
  } else {
      console.log("Not in main DOM. Checking iframes...");
      const frames = page.frames();
      for (const frame of frames) {
          const frameText = await frame.evaluate(() => document.body.innerText).catch(() => "");
          if (frameText.includes('Leanne Teo') || frameText.includes('Akesh Abhilash')) {
              console.log("Found in iframe:", frame.url());
              const html = await frame.content();
              const fs = require('fs');
              fs.writeFileSync('reviews_frame.html', html);
              console.log("Saved frame HTML to reviews_frame.html");
          }
      }
  }

  await browser.close();
})();
