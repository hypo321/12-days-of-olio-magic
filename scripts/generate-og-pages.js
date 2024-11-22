import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const descriptions = [
  "Discover what's behind Door #1 in our magical Olio advent calendar! ",
  "Day 2 of our Olio advent calendar is ready to be revealed! What surprises await? ",
  "It's Day 3 of the Olio Magic! Peek behind today's door for a festive surprise! ",
  "Day 4 brings more holiday cheer in our magical Olio advent calendar! ",
  "What magical moment awaits behind Door #5? Open to find out! ",
  "Day 6 of our Olio advent calendar is full of festive surprises! ",
  "Lucky Day 7! What holiday magic lies behind today's door? ",
  "8 days of magic so far! What's behind today's festive door? ",
  "Day 9 brings more holiday joy in our magical advent calendar! ",
  "10 days of Olio magic! What festive surprise awaits today? ",
  "Day 11 is here with more holiday cheer! What's behind the door? ",
  "The final day of Olio magic! What special surprise completes our journey? "
];

const generatePage = (day, description) => {
  const dayDir = path.join(__dirname, '..', 'public', 'day', day.toString());
  fs.mkdirSync(dayDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Day ${day} - 12 Days of Olio Magic</title>

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://12-days-of-olio-magic.vercel.app/day/${day}" />
    <meta property="og:title" content="Day ${day} - 12 Days of Olio Magic" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://12-days-of-olio-magic.vercel.app/day/${day}" />
    <meta property="twitter:title" content="Day ${day} - 12 Days of Olio Magic" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg" />

    <!-- Redirect to the main app -->
    <meta http-equiv="refresh" content="0;url=/#/day/${day}" />
  </head>
  <body>
    <p>Redirecting to Day ${day}...</p>
  </body>
</html>`;

  fs.writeFileSync(path.join(dayDir, 'index.html'), html);
  console.log(`Generated page for Day ${day}`);
};

// Generate pages for all 12 days
for (let day = 1; day <= 12; day++) {
  generatePage(day, descriptions[day - 1]);
}

console.log('All pages generated successfully!');
