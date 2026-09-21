import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import chalk from 'chalk';
import { chromium } from 'playwright';
import { generateHTML, generateResumeHTML } from '../src/renderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const CHROMIUM = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium';
const PORT = Number(process.env.PORT) || 3000;

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

function buildData(input = {}) {
  const name = String(input.name || '').trim() || 'Your Name';
  const title = String(input.title || '').trim() || 'Developer';
  return {
    title: name,
    name,
    subtitle: title,
    body: md.render(String(input.content || '')),
    social: Array.isArray(input.social)
      ? input.social.filter((s) => s && (s.label || s.url))
      : [],
  };
}

const safeBase = (name) =>
  String(name || 'portfolio').toLowerCase().trim().replace(/\s+/g, '_') || 'portfolio';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(PUBLIC_DIR));

app.get('/api/capabilities', (_req, res) =>
  res.json({ pdf: fs.existsSync(CHROMIUM) }));

app.post('/api/render', (req, res) => {
  try {
    const theme = String(req.body.theme || 'noir').toLowerCase();
    res.type('html').send(generateHTML(buildData(req.body), theme));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/parse', (req, res) => {
  try {
    const { data, content } = matter(String(req.body.raw || ''));
    res.json({ name: data.name, title: data.title, social: data.social || [], content });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    const input = req.body || {};
    const name = String(input.name || '').trim() || 'Your Name';
    const title = String(input.title || '').trim() || 'Developer';
    const social = (Array.isArray(input.social) ? input.social : [])
      .filter((s) => s && (s.label || s.url));
    const file = matter.stringify(String(input.content || ''), { name, title, social });
    const filename = `${safeBase(name)}_portfolio.md`;
    await fs.writeFile(path.join(process.cwd(), filename), file);
    res.json({ filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pdf', async (req, res) => {
  if (!fs.existsSync(CHROMIUM)) {
    return res.status(503).json({
      error: 'Chromium not found — PDF is available in the Docker image, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH',
    });
  }
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROMIUM,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setContent(generateResumeHTML(buildData(req.body)), {
      waitUntil: 'networkidle',
    });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeBase(req.body.name)}_resume.pdf"`);
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(chalk.green(`✔ Renderfolio web studio → http://localhost:${PORT}`));
  if (!fs.existsSync(CHROMIUM)) {
    console.log(chalk.yellow('  ⚠ Chromium not found — PDF disabled (HTML works fine)'));
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(chalk.red(`✖ Port ${PORT} in use — try: PORT=${PORT + 1} node web/server.js`));
  } else {
    console.error(chalk.red(`✖ ${err.message}`));
  }
  process.exit(1);
});