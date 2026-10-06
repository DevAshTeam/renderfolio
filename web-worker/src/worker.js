import puppeteer from '@cloudflare/puppeteer';
import { createApp } from '../../web/routes.js';

const pdfWithBrowser = async (env, resumeHtml) => {
  const browser = await puppeteer.launch(env.BROWSER);
  try {
    const page = await browser.newPage();
    await page.setContent(resumeHtml, { waitUntil: 'networkidle0' });
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
    });
  } finally {
    await browser.close();
  }
};

export default {
  async fetch(request, env) {
    const app = createApp({
      generatePdf: env.BROWSER ? (html) => pdfWithBrowser(env, html) : null,
    });
    return app.fetch(request);
  },
};