import { Command } from 'commander';
import { newCommand } from '../src/commands/new.js';

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


program.parse();