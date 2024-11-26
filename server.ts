import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    const url = req.originalUrl
    const dayMatch = url.match(/\/day\/(\d+)/)
    const day = dayMatch ? dayMatch[1] : null

    try {
      // Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template)

      // Generate meta tags based on the URL
      const metaTags = generateMetaTags(day)
      template = template.replace('</head>', `${metaTags}</head>`)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(5173)
}

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

createServer()
