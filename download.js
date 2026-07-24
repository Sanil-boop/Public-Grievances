const https = require('https');
const fs = require('fs');

const url = 'https://m.economictimes.com/thumb/msid-114092305,width-1200,height-900,resizemode-4,imgsize-29362/ratan-tata.jpg';
const dest = 'public/images/ratan-tata.jpg';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  }
}, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded successfully. Size:', fs.statSync(dest).size, 'bytes');
    });
  } else {
    console.log('Failed:', res.statusCode);
  }
}).on('error', (err) => {
  console.log('Error:', err.message);
});
