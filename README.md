# Meida home page

Public site for **getmeida.com**. The app itself is at **platform.getmeida.com**.

Plain HTML, CSS and one `script.js` in `public/`, so there is no build step. French by default, with Arabic (right-to-left) available.

## Edit

- Content and plans: `public/index.html`. Arabic text is in the `AR` table in `public/script.js`.
- Settings are in the `CONFIG` block at the top of `public/script.js`: login link, contact e-mail, WhatsApp number and an optional form endpoint (Formspree or similar; when empty, the form opens the visitor's e-mail app).
- The plan section mirrors the app's feature catalog (`apps/api/src/entitlements/feature-catalog.ts`) and plan limits. Update it when those change. No prices are shown.
- If you change the inline `<script>` in `index.html`, update its hash in the CSP in `nginx.conf`.

## Run locally

```sh
docker build -t meida-home . && docker run --rm -p 8080:80 meida-home
```

Then open http://localhost:8080.

## Deploy (Coolify)

1. New project → resource from this repo, branch `main`, build pack **Dockerfile**, port **80**.
2. Domains: `https://getmeida.com,https://www.getmeida.com`, with the www → non-www redirect on.
3. DNS: A records for `@` and `www` pointing to the server's IP.
4. Turn on auto-deploy: every push to `main` goes live.
