const https = require('https');

https.get('https://en.wikipedia.org/wiki/Ratan_Tata', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/.*?\/Ratan_Tata_photo\.jpg\/.*?)"/);
    if (match) {
      console.log('Found URL:', match[1]);
    } else {
      console.log('Image not found in HTML');
    }
  });
});
