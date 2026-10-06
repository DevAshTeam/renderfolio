import { Hono } from 'hono';
import MarkdownIt from 'markdown-it';
import * as jsYaml from 'js-yaml';
const yaml = jsYaml.default ?? jsYaml;
import { generateHTML, generateResumeHTML } from '../src/renderer.js';

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

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, content: raw };
  let data = {};
  try { data = yaml.load(m[1]) || {}; } catch { /* bad YAML → empty data */ }
  return { data, content: raw.slice(m[0].length) };
}

export const safeBase = (name) =>
  String(name || 'portfolio').toLowerCase().trim().replace(/\s+/g, '_') || 'portfolio';

export function createApp({ generatePdf = null } = {}) {
  const app = new Hono();

  app.onError((err, c) => c.json({ error: err.message }, 500));
  app.notFound((c) => c.json({ error: 'Not found' }, 404));

  app.get('/api/capabilities', (c) => c.json({ pdf: !!generatePdf }));

  app.post('/api/render', async (c) => {
    const body = await c.req.json();
    const theme = String(body.theme || 'noir').toLowerCase();
    return c.html(generateHTML(buildData(body), theme));
  });

  app.post('/api/parse', async (c) => {
    const body = await c.req.json();
    const { data, content } = parseFrontmatter(String(body.raw || ''));
    return c.json({ name: data.name, title: data.title, social: data.social || [], content });
  });

  app.post('/api/pdf', async (c) => {
    if (!generatePdf) {
      return c.json({ error: 'PDF is not available on this deployment' }, 503);
    }
    const body = await c.req.json();
    const pdf = await generatePdf(generateResumeHTML(buildData(body)));
    return c.body(pdf, 200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeBase(body.name)}_resume.pdf"`,
    });
  });

  return app;
}