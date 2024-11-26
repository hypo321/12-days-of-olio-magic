import { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

function generateMetaTags(day: string | null) {
  if (!day) {
    return `
      <title>The 12 Days of Olio Magic</title>
      <meta name="title" content="The 12 Days of Olio Magic" />
      <meta name="description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://12-days-of-olio-magic.vercel.app/" />
      <meta property="og:title" content="The 12 Days of Olio Magic" />
      <meta property="og:description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight." />
      <meta property="og:image" content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://12-days-of-olio-magic.vercel.app/" />
      <meta name="twitter:title" content="The 12 Days of Olio Magic" />
      <meta name="twitter:description" content="Join us for 12 days of magical surprises in our interactive advent calendar! Each day brings a new festive delight." />
      <meta name="twitter:image" content="https://12-days-of-olio-magic.vercel.app/images/og/main.jpg" />
    `
  }

  return `
    <title>The 12 Days of Olio Magic - Day ${day}</title>
    <meta name="title" content="The 12 Days of Olio Magic - Day ${day}" />
    <meta name="description" content="Discover what's behind Door #${day} in our magical Olio advent calendar!" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://12-days-of-olio-magic.vercel.app/day/${day}" />
    <meta property="og:title" content="The 12 Days of Olio Magic - Day ${day}" />
    <meta property="og:description" content="Discover what's behind Door #${day} in our magical Olio advent calendar!" />
    <meta property="og:image" content="https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://12-days-of-olio-magic.vercel.app/day/${day}" />
    <meta name="twitter:title" content="The 12 Days of Olio Magic - Day ${day}" />
    <meta name="twitter:description" content="Discover what's behind Door #${day} in our magical Olio advent calendar!" />
    <meta name="twitter:image" content="https://12-days-of-olio-magic.vercel.app/images/og/day${day}.jpg" />
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = req.url || '/'
    const dayMatch = url.match(/\/day\/(\d+)/)
    const day = dayMatch ? dayMatch[1] : null

    // Read the index.html template
    const template = fs.readFileSync(
      path.join(process.cwd(), 'dist', 'client', 'index.html'),
      'utf-8'
    )

    // Insert meta tags
    const metaTags = generateMetaTags(day)
    const html = template.replace('</head>', `${metaTags}</head>`)

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
