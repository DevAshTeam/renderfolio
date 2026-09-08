import fs from 'fs-extra';
import chalk from 'chalk';

export async function newCommand(name) {
  const safeName = name.toLowerCase().replace(/\s+/g, '_');
  const fileName = `${safeName}_portfolio.md`;

  const template = `---
name: "${name}"
title: "Full-Stack Developer"
social:
  - label: LinkedIn
    url: https://linkedin.com/in/yourusername
  - label: GitHub
    url: https://github.com/yourusername
  - label: Website
    url: https://yourwebsite.com
---

## About

Short introduction about yourself.

## Skills

- JavaScript / TypeScript
- Node.js
- Docker & DevOps
- MongoDB / ScyllaDB / PostgreSQL
- Cloudflare Workers

## Projects

### Project One
Short description of the project.  
[GitHub](https://github.com/yourusername/project-one)

### Project Two
Short description of the project.  
[GitHub](https://github.com/yourusername/project-two)

### Personal Blog
I write about backend architecture and databases.  
[Visit Website](https://yourblog.com)

### Live Demo - File Server
A simple and fast file server.  
[Live Demo](https://demo.yoursite.com) · [Source Code](https://github.com/yourusername/file-server)
`;

  await fs.writeFile(fileName, template);

  console.log(chalk.green(`✔ Created ${fileName}`));
  console.log(chalk.gray(`\nNext steps:`));
  console.log(chalk.gray(`  renderfolio render ${fileName}`));
  console.log(chalk.gray(`  renderfolio render ${fileName} --pdf`));
  console.log(chalk.gray(`  renderfolio render ${fileName} --theme themName(terminal|slate - default theme: noir)`));
}