import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { chromium } from 'playwright';
import { generateHTML, generateResumeHTML } from '../renderer.js';

export async function renderCommand(file, options) {
    if (!(await fs.pathExists(file))) {
        console.error(chalk.red(`✖ File not found: ${file}`));
        process.exit(1);
    }
    const outputDir = './output';
    await fs.ensureDir(outputDir);

    const raw = await fs.readFile(file, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });

    const bodyHtml = md.render(content);
    const baseName = path.basename(file, path.extname(file));

    const data = {
    title: frontmatter.name || frontmatter.title || 'Portfolio',
    name: frontmatter.name || 'Your Name',
    subtitle: frontmatter.title || frontmatter.subtitle || 'Developer',
    body: bodyHtml,
    social: frontmatter.social || [],
  };
  const theme = (options.theme || 'noir').toLowerCase();

  //Generate HTML portfolio 
  const html = generateHTML(data, theme);
  const htmlPath = path.join(outputDir, `${baseName}.html`);
  await fs.writeFile(htmlPath, html);
  console.log(chalk.green(`✔ HTML portfolio → ${htmlPath}  (theme: ${theme})`));

  //Generate PDF Resume
  if (options.pdf) {
    const resumeHtml = generateResumeHTML(data);
    const tempResumePath = path.join(outputDir, `${baseName}-resume-temp.html`);
    await fs.writeFile(tempResumePath, resumeHtml);

    const pdfPath = path.join(outputDir, `${baseName}.pdf`);
    console.log(chalk.blue('⏳ Generating clean resume PDF...'));

    const browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(tempResumePath)}`, {
      waitUntil: 'networkidle',
    });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });

    await browser.close();
    await fs.remove(tempResumePath);

    console.log(chalk.green(`✔ Resume PDF     → ${pdfPath}`));
  }
  
  console.log(chalk.blue('\nDone!'));
    
}