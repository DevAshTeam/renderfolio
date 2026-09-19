import fs from 'fs-extra';
import { withTmpWorkspace } from './helpers.js';
import { newCommand } from '../src/commands/new.js';

describe('new command', () => {
  test('creates <name>_portfolio.md from a full name', async () => {
    await withTmpWorkspace(async () => {
      await newCommand('John Doe');
      expect(await fs.pathExists('john_doe_portfolio.md')).toBe(true);
    });
  });

  test('normalizes case and collapses multiple spaces', async () => {
    await withTmpWorkspace(async () => {
      await newCommand('Jane   Ann Smith');
      expect(await fs.pathExists('jane_ann_smith_portfolio.md')).toBe(true);
    });
  });

  test('template contains frontmatter and the sections the renderer expects', async () => {
    await withTmpWorkspace(async () => {
      await newCommand('John Doe');
      const raw = await fs.readFile('john_doe_portfolio.md', 'utf-8');

      expect(raw).toMatch(/^---\n[\s\S]*\n---\n/); // frontmatter block
      expect(raw).toContain('name: "John Doe"');
      expect(raw).toContain('## About');
      expect(raw).toContain('## Skills');
      expect(raw).toContain('## Projects');
      expect(raw).toContain('label: LinkedIn'); // social block
    });
  });

  test('overwrites an existing file', async () => {
    await withTmpWorkspace(async () => {
      await fs.writeFile('john_doe_portfolio.md', 'stale content');
      await newCommand('John Doe');
      const raw = await fs.readFile('john_doe_portfolio.md', 'utf-8');
      expect(raw).toContain('## About');
    });
  });
});