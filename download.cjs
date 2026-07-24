const https = require('https');
const fs = require('fs');

const url = 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202212/ratan_tata-sixteen_nine.jpg';
const dest = 'public/images/ratan-tata.jpg';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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
