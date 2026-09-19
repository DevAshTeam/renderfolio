[![CI](https://github.com/DevAshTeam/renderfolio/actions/workflows/test.yml/badge.svg)](https://github.com/DevAshTeam/renderfolio/actions/workflows/test.yml)
[![Live demo](https://img.shields.io/badge/demo-GitHub_Pages-2ea44f)](https://DevAshTeam.github.io/renderfolio/)

# Renderfolio

Turn a Markdown file into a themed HTML portfolio — and optionally a clean PDF resume. Ships as a Docker image: no Node.js or Chromium needed on your machine.

## Requirements

- **Docker with Compose v2** (check: `docker compose version`)

## Setup

```bash
git clone https://github.com/DevAshTeam/renderfolio.git
cd renderfolio
docker compose build
mkdir portfolio
```

### Linux only

Run the container as your own user, otherwise files in `portfolio/` are owned by uid 1001:

```bash
printf 'CONTAINER_UID=%s\nCONTAINER_GID=%s\n' "$(id -u)" "$(id -g)" > .env
```

(Docker Desktop on macOS/Windows: skip this.)

## Usage

```bash
# 1. Create a template → portfolio/john_doe_portfolio.md
docker compose run --rm renderfolio new "John Doe"

# 2. Edit portfolio/john_doe_portfolio.md in any editor

# 3. Render → portfolio/output/
docker compose run --rm renderfolio render john_doe_portfolio.md --theme terminal --pdf
```

Output lands in `portfolio/output/`: `john_doe_portfolio.html` (+ `john_doe_portfolio.pdf` with `--pdf`).

## Options

| Option               | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `-t, --theme <name>` | **noir** (default), terminal, slate, paper, rose, forge |
| `--pdf`              | Also generate a clean A4 resume PDF                     |

**Files must live inside `portfolio/`** — it's the only folder shared with the container, and paths are relative to it.

## Markdown Format

```yaml
---
name: "John Doe"
title: "Full-Stack Developer"
social:
  - label: GitHub
    url: https://github.com/yourusername
---

## About

Short introduction about yourself.

## Skills

- JavaScript / TypeScript
- Docker & DevOps

## Projects

### Project One

Short description.

[GitHub](https://github.com/you/project-one)
```

### Front Matter & Sections

- **`name`** → page title
- **`title`** → subtitle
- **`social`** → header links
- **`## sections`** become portfolio sections
- **`### under Projects`** become project cards

## Troubleshooting

| Issue                                         | Solution                                                     |
| --------------------------------------------- | ------------------------------------------------------------ |
| **EACCES (Linux)**                            | Create the `.env` as shown in Setup, then `sudo chown -R "$(id -u):$(id -g)" portfolio` |
| **File not found**                            | The `.md` must be in `portfolio/` and passed relative to it (`render john_doe_portfolio.md`, not `render portfolio/john_doe_portfolio.md`) |
| **No output visible**                         | It's in `portfolio/output/`; anything written elsewhere in the container is discarded on exit |
| **`docker compose up` prints help and exits** | Expected — this is a one-shot CLI; use `docker compose run --rm renderfolio <command>` |
| **Changed source code?**                      | Rebuild first: `docker compose build`                        |

## Live demo

Rendered from one markdown file — [examples/john_doe_portfolio.md](https://github.com/examples/john_doe_portfolio.md) — in six themes:   [noir](https://DevAshTeam.github.io/renderfolio/noir.html) ·[terminal](https://DevAshTeam.github.io/renderfolio/terminal.html) ·[slate](https://DevAshTeam.github.io/renderfolio/slate.html) ·[paper](https://DevAshTeam.github.io/renderfolio/paper.html) ·[rose](https://DevAshTeam.github.io/renderfolio/rose.html) ·[forge](https://DevAshTeam.github.io/renderfolio/forge.html)

## License

**AGPL-3.0**
