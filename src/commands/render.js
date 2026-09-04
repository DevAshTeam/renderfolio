import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { generateHTML } from '../renderer.js';

export async function renderCommand(file, options) {
    if (!(await fs.pathExists(file))) {
        console.error(chalk.red(`✖ File not found: ${file}`));
        process.exit(1);
    }
    const outputDir = options.output || './output';
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

  //Generate HTML portfolio 
  const html = generateHTML(data);
  const htmlPath = path.join(outputDir, `${baseName}.html`);
  await fs.writeFile(htmlPath, html);
  console.log(chalk.green(`✔ HTML portfolio → ${htmlPath}`));

  
  console.log(chalk.blue('\nDone!'));
    
}