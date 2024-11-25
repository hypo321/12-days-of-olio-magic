import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define image dimensions
const dimensions = {
  full: {
    width: 1920,
    height: 1080
  },
  thumbnail: {
    width: 400,
    height: 225  // Maintains 16:9 aspect ratio
  }
};

// Define source images and their target days
const imageMapping = {
  'welcome.jpg': 'day1',            // Welcome splash
  'founders.jpg': 'day2',           // Tessa and Saasha
  'food-heroes.jpg': 'day3',        // Food Waste Heroes
  'community.jpg': 'day4',          // Community Impact
  'environment.jpg': 'day5',        // Environmental Impact
  'matches.jpg': 'day6',            // OLIO Made Matches
  'zero-waste.jpg': 'day7',         // Zero Waste Living
  'global.jpg': 'day8',             // Global Movement
  'business.jpg': 'day9',           // Business Impact
  'heroes.jpg': 'day10',            // Community Heroes
  'vision.jpg': 'day11',            // Future Vision
  'join.jpg': 'day12'              // Join the Movement
};

async function processImage(sourcePath, targetDir, baseName, size, quality = 80) {
  const targetPath = path.join(targetDir, `${baseName}${size === 'thumbnail' ? '-thumb' : ''}.jpg`);
  
  try {
    await sharp(sourcePath)
      .resize(dimensions[size].width, dimensions[size].height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality }) // Optimize JPEG quality
      .toFile(targetPath);

    console.log(`Generated ${path.basename(targetPath)}`);
  } catch (error) {
    console.error(`Error processing ${baseName}:`, error.message);
  }
}

async function generateContentImages() {
  const contentDir = path.join(__dirname, '..', 'public', 'content');
  const sourceDir = path.join(__dirname, '..', 'source-images');

  // Ensure content directory exists
  try {
    await fs.mkdir(contentDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  // Process each image
  for (const [source, baseTarget] of Object.entries(imageMapping)) {
    const sourcePath = path.join(sourceDir, source);

    // Generate both full-size and thumbnail versions
    await Promise.all([
      processImage(sourcePath, contentDir, baseTarget, 'full'),
      processImage(sourcePath, contentDir, baseTarget, 'thumbnail', 85)
    ]);
  }
}

generateContentImages()
  .then(() => console.log('Content image generation complete!'))
  .catch(err => console.error('Error generating content images:', err));
