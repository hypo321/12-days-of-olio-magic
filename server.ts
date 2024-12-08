import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

function generateMetaTags(day: string | null) {
  const baseUrl = 'https://12-days-of-olio-magic.vercel.app';

  if (!day) {
    return {
      title: 'The 12 Days of Olio Magic',
      description:
        'Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight.',
      url: baseUrl,
      image: `${baseUrl}/images/og/main.jpg`,
    };
  }

  return {
    title: `The 12 Days of Olio Magic - Day ${day}`,
    description: `Discover what's behind Door #${day} in our magical Olio advent calendar!`,
    url: `${baseUrl}/day/${day}`,
    image: `${baseUrl}/images/og/day${day}.jpg`,
  };
}

function generateHtmlWithMeta(
  template: string,
  meta: ReturnType<typeof generateMetaTags>
) {
  const metaTags = `
    <!-- Primary Meta Tags -->
    <title>${meta.title}</title>
    <meta name="title" content="${meta.title}" />
    <meta name="description" content="${meta.description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${meta.url}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
  `;

  // First remove any existing meta tags to avoid duplicates
  const cleanTemplate = template.replace(
    /<title>.*?<\/title>|<meta\s+(?:name|property)="(?:title|description|og:.*?|twitter:.*?)".*?>/g,
    ''
  );

  // Insert new meta tags right after the opening head tag
  return cleanTemplate.replace(/<head>/, `<head>${metaTags}`);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const url = req.url || '/';
    const dayMatch = url.match(/\/day\/(\d+)/);
    const day = dayMatch ? dayMatch[1] : null;

    // Read the index.html template
    const template = fs.readFileSync(
      path.join(process.cwd(), 'dist', 'index.html'),
      'utf-8'
    );

    // Generate meta data
    const meta = generateMetaTags(day);

    // Insert meta tags
    const html = generateHtmlWithMeta(template, meta);

    // Set cache control headers
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, must-revalidate'
    );
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    res.status(200).send(html);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details:
        error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
