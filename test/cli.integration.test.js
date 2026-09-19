import fs from 'fs-extra';
import path from 'node:path';
import { runCli, withTmpWorkspace } from './helpers.js';

describe('CLI', () => {
  test('--help exits 0 and describes the tool', async () => {
    const { code, stdout } = await runCli(['--help']);
    expect(code).toBe(0);
    expect(stdout).toMatch(/Render a beautiful portfolio/);
    expect(stdout).toMatch(/Commands/);
  });

  test('--version prints a semver', async () => {
    const { code, stdout } = await runCli(['--version']);
    expect(code).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('render with a missing file exits 1 with a clear error', async () => {
    const { code, stderr } = await runCli(['render', 'nope.md']);
    expect(code).toBe(1);
    expect(stderr).toMatch(/File not found: nope\.md/);
  });

  test('render without a file argument fails', async () => {
    const { code } = await runCli(['render']);
    expect(code).not.toBe(0);
  });

  test('full flow: new → render produces themed HTML', async () => {
    await withTmpWorkspace(async (dir) => {
      const created = await runCli(['new', 'John Doe']);
      expect(created.code).toBe(0);
      expect(created.stdout).toMatch(/Created john_doe_portfolio\.md/);
      expect(await fs.pathExists(path.join(dir, 'john_doe_portfolio.md'))).toBe(true);

      const rendered = await runCli(
        ['render', 'john_doe_portfolio.md', '--theme', 'terminal']
      );
      expect(rendered.code).toBe(0);
      expect(rendered.stdout).toMatch(/HTML portfolio/);

      const html = await fs.readFile(
        path.join(dir, 'output', 'john_doe_portfolio.html'),
        'utf-8'
      );
      expect(html).toContain('John Doe');
    });
  });
});