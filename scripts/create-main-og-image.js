import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMainImage() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'og', 'alldays.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'og', 'main.jpg');

  try {
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);

    console.log('Created main.jpg for Open Graph preview');
  } catch (error) {
    console.error('Error creating main image:', error);
  }
}

createMainImage()
  .then(() => console.log('Main image processing complete!'))
  .catch(err => console.error('Error:', err));
