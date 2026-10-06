import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import matter from 'gray-matter';
import { serve } from '@hono/node-server';
import { chromium } from 'playwright';
import { createApp, safeBase } from './routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const CHROMIUM = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium';
const PORT = Number(process.env.PORT) || 3000;

const generatePdf = fs.existsSync(CHROMIUM)
  ? async (resumeHtml) => {
      const browser = await chromium.launch({
        executablePath: CHROMIUM,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });
      try {
        const page = await browser.newPage();
        await page.setContent(resumeHtml, { waitUntil: 'networkidle' });
        return await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
        });
      } finally {
        await browser.close();
      }
    }
  : null; 

const app = createApp({ generatePdf });

// ────────────────────────────────────────────────────────────────
app.post('/api/save', async (c) => {
  const input = await c.req.json();
  const name = String(input.name || '').trim() || 'Your Name';
  const title = String(input.title || '').trim() || 'Developer';
  const social = (Array.isArray(input.social) ? input.social : [])
    .filter((s) => s && (s.label || s.url));
  const file = matter.stringify(String(input.content || ''), { name, title, social });
  const filename = `${safeBase(name)}_portfolio.md`;
  await fs.writeFile(path.join(process.cwd(), filename), file);
  return c.json({ filename });
});

const indexHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
app.get('/', (c) => c.html(indexHtml));
// ─────────────────────────────────────────────────────────────────────

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(chalk.green(`✔ Renderfolio web studio → http://localhost:${info.port}`));
  console.log(chalk.gray(`  “Save .md” writes to: ${process.cwd()}`));
  if (!generatePdf) {
    console.log(chalk.yellow('  ⚠ Chromium not found — PDF disabled (HTML works fine)'));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(chalk.red(`✖ Port ${PORT} in use — try: PORT=${PORT + 1} node web/server.js`));
  } else {
    console.error(chalk.red(`✖ ${err.message}`));
  }
  process.exit(1);
});