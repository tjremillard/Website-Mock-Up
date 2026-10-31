# Website Mock-Up

This repository is for prototyping the Easement Real Estate website using Codex.

The goal is to create a working website prototype that a professional developer can later build upon.

## Development stack

Next.js App Router, React, TypeScript, and Tailwind CSS. Node.js 24 LTS and npm are used. The app reconstructs the WRA deck and adds owner and infrastructure developer portals. It uses illustrative data and browser-local demo state; it has no production authentication, warehouse connection, live listings, or payment processing. No API keys are required.

## Run on your computer

1. Install Node.js 24 LTS and Git.
2. Clone this GitHub repository, then open a terminal in its folder.
3. Run `npm ci` to install the exact locked dependencies.
4. Run `npm run dev` and open the local address printed in your terminal.
5. Edit the screens in `src/components/`; the browser updates automatically. Press Ctrl+C to stop.

If you use nvm, run `nvm install` and `nvm use` in this folder first.

## Check your changes

Run `npm run lint`, `npm run typecheck`, and `npm run build` before handing off changes. To run the production build, use `npm start` after building. Run `npx playwright install chromium` once, then `npm run test:e2e` after a successful build to exercise the browser workflows. Tests start a production server on port 3100.

## Save to GitHub

Make changes on a branch: `git switch -c describe-your-change`.
Review with `git status` and `git diff`. Stage only the intended files, then run `git commit -m "Describe your change"` and `git push -u origin HEAD`. Open a pull request on GitHub to review and merge into main. GitHub may ask you to sign in on your own computer; never put tokens in source files or chat. In Codex, you can ask it to prepare a commit and push a branch.

## Developer handoff

- `src/app/page.tsx`: prototype entry point.
- `src/components/`: screen copy and interactive workflows.
- `src/lib/demo.ts`: sample data, service definitions, and criteria.
- `src/app/starter/page.tsx`: preserved earlier homepage at `/starter`.
- `src/app/layout.tsx`: document layout and search metadata.
- `src/app/globals.css`: global styling; Tailwind utilities live with components.
- `package-lock.json`: reproducible dependency versions; commit it.
- `.nvmrc`: Node major version.

Use mock data while shaping the experience. Add persistent data, authentication, integrations, and real listing permissions when the requirements are clear. Supabase (PostgreSQL) is a suitable later option; Vercel is a straightforward later hosting choice. Neither is required or configured now. Keep credentials in ignored `.env.local` files and document variable names without values. The initial styling and sample locations are placeholders for the owner's direction.

## Deck reconstruction and portals

See [Developer handoff](docs/DEVELOPER-HANDOFF.md) for the screen map, copy-editing guide, demo behavior, pricing assumptions, tests, and integration requirements. Open the app and use the top navigation: Explore, Owner Portal, Services & Pricing, and Infrastructure Developers.

All portal actions are demonstrations: account creation saves a local profile, payments are simulated, and inquiries are not sent. Do not enter sensitive information. Progress is saved only in this browser; clearing site data resets it. The original residential homepage remains at `/starter`.
