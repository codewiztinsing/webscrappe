const fs = require('fs');
const https = require('https');

function saveImageFromUrl(url, filename) {
  const file = fs.createWriteStream(filename);
  https.get(url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Image saved as ${filename}`);
    });
  }).on('error', error => {
    fs.unlink(filename, () => {
      console.error(`Error saving image: ${error}`);
    });
  });
}

// saveImageFromUrl('https://us.123rf.com/450wm/photochicken/photochicken2008/photochicken200800065/153425631-pritty-jeune-photographe-asiatique-fille-adolescente-voyage-avec-appareil-photo-prendre-une-photo-de.jpg?ver=6', 'image-test.jpg');
module.exports  = {
    saveImageFromUrl
}