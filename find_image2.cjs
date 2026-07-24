const https = require('https');
const fs = require('fs');
const qs = require('querystring');

const query = 'Ratan Tata blue tie looking up';
const searchUrl = https://html.duckduckgo.com/html/?q=;

https.get(searchUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Search complete, length:", data.length);
    // Extract image URL from vqd or just find any img tag in duckduckgo
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    if (matches && matches.length > 1) {
      console.log('Found images:', matches.slice(0, 3));
    } else {
      console.log('No images found in HTML');
    }
  });
});
