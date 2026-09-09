import { Command } from 'commander';
import { newCommand } from '../src/commands/new.js';
import { renderCommand } from '../src/commands/render.js';

const program = new Command();

program
  .name('renderfolio')
  .description('Render a beautiful portfolio from Markdown')
  .version('0.1.0');

program
  .command('new')
  .description('Create a new portfolio template')
  .argument('<name>', 'Your name')
  .action(newCommand);

program
  .command('render')
  .description('Render Markdown to HTML Portfolio')
  .argument('<file>', 'Markdown file to render')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('--pdf', 'Also generate a clean resume PDF')
  .option(
    '-t, --theme <name>',
    'Theme: noir | terminal | slate | paper | rose | forge',
    'noir'
  )
  .action(renderCommand);

program.parse();