import {
  describe,
  test,
  expect,
  jest,
  beforeAll,
  beforeEach,
} from '@jest/globals';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withTmpWorkspace } from './helpers.js';

const launchMock = jest.fn();
const gotoMock = jest.fn();
const pdfMock = jest.fn();
const closeMock = jest.fn();

const seen = { launchOpts: null, gotoUrl: null, resumeHtml: null };

await jest.unstable_mockModule('playwright', () => ({
  chromium: { launch: launchMock },
}));

const { renderCommand } = await import('../src/commands/render.js');

const MD = `---
name: "Jane Dev"
title: "Backend Engineer"
---

## About

I build things.
`;

beforeAll(() => {
  launchMock.mockImplementation(async (opts) => {
    seen.launchOpts = opts;
    return {
      newPage: async () => ({ goto: gotoMock, pdf: pdfMock }),
      close: closeMock,
    };
  });
  gotoMock.mockImplementation(async (url) => {
    seen.gotoUrl = url;
    seen.resumeHtml = await fs.readFile(fileURLToPath(url), 'utf-8');
  });
  pdfMock.mockImplementation(async ({ path: p }) => {
    await fs.writeFile(p, '%PDF-1.4 fake');
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  seen.launchOpts = null;
  seen.gotoUrl = null;
  seen.resumeHtml = null;
});

describe('render command (--pdf)', () => {
  test('launches Chromium, writes the PDF, cleans up the temp file', async () => {
    await withTmpWorkspace(async (dir) => {
      await fs.writeFile('sample.md', MD);
      await renderCommand('sample.md', { theme: 'noir', pdf: true });

      const pdfPath = path.join(dir, 'output', 'sample.pdf');
      expect(await fs.pathExists(pdfPath)).toBe(true);
      expect((await fs.readFile(pdfPath, 'utf-8')).startsWith('%PDF')).toBe(true);

      expect(
        await fs.pathExists(path.join(dir, 'output', 'sample-resume-temp.html'))
      ).toBe(false); 
    });

    expect(launchMock).toHaveBeenCalledTimes(1);
    expect(seen.launchOpts.headless).toBe(true);
    expect(seen.launchOpts.args).toContain('--no-sandbox');
    expect(closeMock).toHaveBeenCalledTimes(1);

    expect(seen.gotoUrl).toMatch(/^file:\/\//);
    expect(seen.gotoUrl).toContain('sample-resume-temp.html'); 
    expect(seen.resumeHtml).toContain('Jane Dev');
    expect(seen.resumeHtml).toContain('<h2>About</h2>');
  });

  test('does not launch a browser without --pdf', async () => {
    await withTmpWorkspace(async () => {
      await fs.writeFile('sample.md', MD);
      await renderCommand('sample.md', { theme: 'noir' });
    });
    expect(launchMock).not.toHaveBeenCalled();
  });
});