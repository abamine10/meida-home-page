# Meida home page

Public site for **getmeida.com**. The app itself is at **platform.getmeida.com**.

Plain HTML, CSS and one `script.js` in `public/`. French is at `/`, Arabic (right-to-left) at `/ar/`.

`build.mjs` (plain Node, no dependencies) turns `public/` into `dist/`, which is what gets served. The Dockerfile runs it on every deploy. It:

- generates `/ar/index.html` from `public/index.html` and the Arabic text in `i18n/ar.json`
- adds the structured data (Organization, WebSite, SoftwareApplication, FAQPage) to both pages, with the FAQ read from the page
- links `style.css` and `script.js` with `?v=<hash>`, so nginx lets browsers keep them for a year

## Edit

- Content and plans: `public/index.html`. Arabic text, titles and descriptions are in `i18n/ar.json`, keyed by each element's `data-i18n`. A new `data-i18n` text without an Arabic entry stays in French on `/ar/` (the build prints a warning).
- When you change the content, update `<lastmod>` in `public/sitemap.xml`.
- Settings are in the `CONFIG` block at the top of `public/script.js`: login link, contact e-mail, WhatsApp number and the form endpoint (`https://platform.getmeida.com/leads`: requests land in the Meida admin under Leads, for the admin and sales reps. The platform must list this site in `LEAD_FORM_ORIGINS`. When empty, the form opens the visitor's e-mail app).
- The plan section mirrors the app's feature catalog (`apps/api/src/entitlements/feature-catalog.ts`) and plan limits. Update it when those change. No prices are shown.
- If you change the inline `<script>` in `index.html`, update its hash in the CSP in `nginx.conf`.
- If you point `formEndpoint` at another host, add that host to `connect-src` in `nginx.conf`, or the browser blocks the request.

## Run locally

```sh
node build.mjs        # writes dist/
docker build -t meida-home . && docker run --rm -p 8080:80 meida-home
```

Then open http://localhost:8080.

## Deploy (Coolify)

1. New project → resource from this repo, branch `main`, build pack **Dockerfile**, port **80**.
2. Domains: `https://getmeida.com,https://www.getmeida.com`, with the www → non-www redirect on.
3. DNS: A records for `@` and `www` pointing to the server's IP.
4. Turn on auto-deploy: every push to `main` goes live.
