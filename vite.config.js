import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fetchNewsItems } from './netlify/functions/_newsFeed.mjs'
import { OFFICIAL_MATCHES } from './src/constants/officialMatches.js'

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isPlaceholderTeam(name = '') {
  return /^(?:[123][A-L]|W\d+|L\d+|3[A-L](?:\/[A-L])+|TBD)$/i.test(String(name).trim())
}

function buildSitemap(siteOrigin) {
  const staticPaths = ['', 'fixtures', 'predictions', 'groups', 'news', 'games', 'scorers', 'about']
  const urls = new Set(staticPaths.map((path) => `${siteOrigin}/${path}`.replace(/\/$/, '/')))

  const teams = new Set()
  for (const match of OFFICIAL_MATCHES) {
    const idBase = `${match.date}-${match.group || match.round}-${match.team1}-vs-${match.team2}`
    urls.add(`${siteOrigin}/match/${slugify(idBase)}`)
    for (const team of [match.team1, match.team2]) {
      if (team && !isPlaceholderTeam(team)) teams.add(team)
    }
  }
  for (const team of teams) {
    urls.add(`${siteOrigin}/team/${encodeURIComponent(team)}`)
  }

  const body = [...urls]
    .map((loc) => `  <url><loc>${loc}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

function buildAdsTxt(client) {
  const publisherId = (client || '').trim().replace(/^ca-/, '')
  if (!publisherId) {
    return '# Set the VITE_ADSENSE_CLIENT env var (e.g. ca-pub-0000000000000000) to publish your AdSense ads.txt line.\n'
  }
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
}

// Generates SEO assets (sitemap with every match/team URL) and the AdSense ads.txt
// file into the build output so search engines and Google AdSense can index/verify.
// Reads env via Vite's loadEnv so it picks up .env files locally and Netlify-injected
// VITE_ vars in production.
function seoAssetsPlugin() {
  let env = {}
  return {
    name: 'wc2026-seo-assets',
    apply: 'build',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, 'VITE_')
    },
    closeBundle() {
      const siteOrigin = (env.VITE_SITE_ORIGIN || 'https://world-cup2026.netlify.app').replace(/\/$/, '')
      const outDir = resolve(process.cwd(), 'dist')
      writeFileSync(resolve(outDir, 'sitemap.xml'), buildSitemap(siteOrigin))
      writeFileSync(resolve(outDir, 'ads.txt'), buildAdsTxt(env.VITE_ADSENSE_CLIENT || 'ca-pub-8402742047549234'))
    },
  }
}

// Mirrors the Netlify news function on the Vite dev server so the frontend can call
// the same /.netlify/functions/news endpoint locally (npm run dev) and in production.
function devNewsApiPlugin() {
  return {
    name: 'wc2026-dev-news-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/news', async (req, res) => {
        const url = new URL(req.url || '', 'http://localhost')
        const query = url.searchParams.get('q') || 'FIFA World Cup 2026'
        const limit = url.searchParams.get('n') || 24
        res.setHeader('Content-Type', 'application/json')
        try {
          const items = await fetchNewsItems(query, limit)
          res.end(JSON.stringify({ items }))
        } catch (error) {
          res.statusCode = 502
          res.end(JSON.stringify({ items: [], error: String(error?.message || error) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devNewsApiPlugin(), seoAssetsPlugin()],
})
