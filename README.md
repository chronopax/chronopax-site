# chronopax.com

Personal site for Joe Burley — network, cloud, and systems architecture consulting. Built with [Astro](https://astro.build) (originally from the Koibumi template) and hosted on Cloudflare Pages.

## Deploys

- **Production:** every merge to `main` builds and publishes to chronopax.com automatically.
- **Previews:** every other branch gets a preview URL at `<branch>.chronopax-site.pages.dev`.

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # type-check + production build into dist/
```

## Common edits

| What | Where |
|---|---|
| Project cards (homepage + /projects) | `src/data/projects.ts` — set `featured: true` to show on the homepage, add `link` to show "Learn more" |
| Homepage bio | `src/pages/index.astro` |
| Consulting copy | `src/pages/consulting/index.astro` |
| Site title / description | `content/site.json` |
| Blog posts | Markdown files in `content/blog/` |

## Contact form

`/contact` → `functions/api/contact.js` (Pages Function) → `chronopax-contact` Worker (`workers/contact/`) → Cloudflare Email Sending from `website@notify.chronopax.com` to `joe@chronopax.com`.

- Spam protection: Cloudflare Turnstile widget `chronopax-contact`, plus a hidden honeypot field.
- Pages project has a service binding `CONTACT` → `chronopax-contact` (preview and production).
- The Worker is deployed separately from the site. After changing `workers/contact/`, redeploy it with `npx wrangler deploy` from that folder.
