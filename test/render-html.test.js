import fs from 'fs-extra';
import path from 'node:path';
import { withTmpWorkspace } from './helpers.js';
import { renderCommand } from '../src/commands/render.js';

const MD = `---
name: "Jane Dev"
title: "Backend Engineer"
social:
  - label: GitHub
    url: https://github.com/janedev
---

## About

I build things.

## Projects

### Alpha

My best project.
`;

async function renderInTmp(md, options = {}) {
  return withTmpWorkspace(async (dir) => {
    await fs.writeFile('sample.md', md);
    await renderCommand('sample.md', options);
    return fs.readFile(path.join(dir, 'output', 'sample.html'), 'utf-8');
  });
}

describe('render command (HTML)', () => {
  test('writes output/<base>.html with frontmatter data and rendered markdown', async () => {
    const html = await renderInTmp(MD, { theme: 'noir' });

    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('Jane Dev');            // name
    expect(html).toContain('Backend Engineer');    // title → subtitle
    expect(html).toContain('<h2>About</h2>');      // markdown section
    expect(html).toContain('<h3>Alpha</h3>');      // project heading
    expect(html).toContain('https://github.com/janedev'); // social link
  });

  test('falls back to defaults when frontmatter is missing', async () => {
    const html = await renderInTmp('## About\n\nHello\n', { theme: 'noir' });
    expect(html).toMatch(/Your Name|Portfolio/);
  });

  test('different themes produce different HTML', async () => {
    const noir = await renderInTmp(MD, { theme: 'noir' });
    const terminal = await renderInTmp(MD, { theme: 'terminal' });
    expect(noir).not.toEqual(terminal);
  });

  test('creates the output directory if it does not exist', async () => {
    await withTmpWorkspace(async (dir) => {
      await fs.writeFile('sample.md', MD);
      await renderCommand('sample.md', { theme: 'noir' });
      expect(await fs.pathExists(path.join(dir, 'output', 'sample.html'))).toBe(true);
    });
  });
});