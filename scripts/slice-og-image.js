import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sliceImage() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'og', 'alldays.jpg');
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'og');

  // Get the image metadata
  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;

  // Calculate dimensions for each slice
  const cols = 4;
  const rows = 3;
  const sliceWidth = Math.floor(width / cols);
  const sliceHeight = Math.floor(height / rows);

  console.log(`Original image: ${width}x${height}`);
  console.log(`Slice size: ${sliceWidth}x${sliceHeight}`);

  // Create slices
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dayNumber = row * cols + col + 1;
      
      // Skip if we've done all 12 days
      if (dayNumber > 12) continue;

      const left = col * sliceWidth;
      const top = row * sliceHeight;

      console.log(`Processing day ${dayNumber}: Extract from (${left},${top})`);

      try {
        await sharp(inputPath)
          .extract({
            left,
            top,
            width: sliceWidth,
            height: sliceHeight
          })
          // Resize to recommended Open Graph image size (1200x630)
          .resize(1200, 630, {
            fit: 'cover',
            position: 'center'
          })
          .toFile(path.join(outputDir, `day${dayNumber}.jpg`));

        console.log(`Created day${dayNumber}.jpg`);
      } catch (error) {
        console.error(`Error processing day ${dayNumber}:`, error);
      }
    }
  }
}

sliceImage()
  .then(() => console.log('All images processed successfully!'))
  .catch(err => console.error('Error:', err));
