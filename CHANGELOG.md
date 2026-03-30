# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `@clipr/core` — Shared types, validation, slug generation (sqids), UTM utilities, backend interfaces
- `clipr` CLI — 13 commands: init, shorten, list, delete, info, edit, config, deploy, stats, qr, import, export, build
- `clipr` programmatic API — `import { shorten, list, resolve, remove, stats } from 'clipr'`
- `@clipr/worker` — Cloudflare Worker with redirect, shorten, links, stats, QR, password, import/export routes
- `@clipr/web` — Astro landing page with 15 themes, 12 languages, canvas effects, terminal demos
- 15 color themes (Hacker, Dracula, Nord, Catppuccin, Synthwave, Matrix, Blood Moon, Midnight, Arctic, Gruvbox, Cyberpunk, Nebula, Solarized, Rose Pine, Monokai)
- 12 canvas effects (particles, snowfall, bubbles, embers, starfield, light dust, fireflies, blood rain, purple particles, neon sparks, cosmic dust, retro grid)
- 12 languages (English, Spanish, French, German, Portuguese, Russian, Chinese, Hindi, Arabic, Urdu, Bengali, Japanese)
- GitHub Actions CI (lint, test, build matrix), deploy-pages, issue-shortener
