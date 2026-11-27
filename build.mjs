// Builds the site into dist/ (run by the Dockerfile on every deploy, or by hand: `node build.mjs`).
//  - dist/index.html     French page (public/index.html) with structured data added
//  - dist/ar/index.html  Arabic page, generated from public/index.html + i18n/ar.json
//  - style.css / script.js links get ?v=<content hash>, so nginx can cache them for a year
// No dependencies: plain Node.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { createHash } from "node:crypto";

const SITE = "https://getmeida.com";
const EMAIL = "contact@getmeida.com";
const AR = JSON.parse(readFileSync("i18n/ar.json", "utf8"));

rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });

const hash = (f) => createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 10);
const ver = { "/style.css": hash("public/style.css"), "/script.js": hash("public/script.js") };
const stamp = (html) => html.replace(/(href|src)="(\/style\.css|\/script\.js)"/g, (m, a, p) => `${a}="${p}?v=${ver[p]}"`);

function swap(html, from, to) {
  if (!html.includes(from)) throw new Error(`build.mjs: expected text not found in index.html: ${from}`);
  return html.split(from).join(to);
}
const attr = (html, re, value) => {
  if (!re.test(html)) throw new Error(`build.mjs: expected tag not found: ${re}`);
  return html.replace(re, (m, pre) => pre + value.replace(/"/g, "&quot;") + '"');
};
const plain = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function jsonLd(html, lang, url, appDescription) {
  const faq = [...html.matchAll(/<summary data-i18n="q\d+t">([\s\S]*?)<\/summary><p data-i18n="q\d+">([\s\S]*?)<\/p>/g)];
  if (faq.length < 7) throw new Error(`build.mjs: found ${faq.length} FAQ entries, expected 7`);
  const org = { "@id": `${SITE}/#org` };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", ...org, name: "Dzira Technology", url: `${SITE}/`, logo: `${SITE}/assets/favicon-512.png`, email: EMAIL,
        brand: { "@type": "Brand", name: "Meida" },
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: EMAIL, areaServed: "DZ", availableLanguage: ["fr", "ar"] } },
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Meida", inLanguage: ["fr-DZ", "ar-DZ"], publisher: org },
      { "@type": "SoftwareApplication", "@id": `${SITE}/#app`, name: "Meida", url: `${SITE}/`, applicationCategory: "BusinessApplication",
        applicationSubCategory: "Point of Sale", operatingSystem: "Web, Android", inLanguage: lang, description: appDescription,
        areaServed: { "@type": "Country", name: "Algeria" }, publisher: org },
      { "@type": "FAQPage", "@id": `${url}#faq`, url, inLanguage: lang,
        mainEntity: faq.map(([, q, a]) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })) }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
const LD_MARK = /<!-- structured data[^>]*-->/;

/* ---------- French ---------- */
const src = readFileSync("public/index.html", "utf8");
if (!LD_MARK.test(src)) throw new Error("build.mjs: structured-data marker missing from index.html");
const frDesc = "Plateforme de gestion pour restaurants, cafés et fast-foods : caisse, cuisine, menu QR, rapports.";
writeFileSync("dist/index.html", stamp(src.replace(LD_MARK, jsonLd(src, "fr-DZ", `${SITE}/`, frDesc))));

/* ---------- Arabic ---------- */
let ar = src;
ar = swap(ar, '<html lang="fr" dir="ltr">', '<html lang="ar" dir="rtl">');
ar = ar.replace(/<title>[^<]*<\/title>/, `<title>${AR.meta.title}</title>`);
ar = attr(ar, /(<meta name="description" content=")[^"]*"/, AR.meta.description);
ar = attr(ar, /(<meta property="og:title" content=")[^"]*"/, AR.meta.og_title);
ar = attr(ar, /(<meta name="twitter:title" content=")[^"]*"/, AR.meta.og_title);
ar = attr(ar, /(<meta property="og:description" content=")[^"]*"/, AR.meta.og_description);
ar = attr(ar, /(<meta name="twitter:description" content=")[^"]*"/, AR.meta.og_description);
ar = attr(ar, /(<meta property="og:image:alt" content=")[^"]*"/, AR.meta.og_description);
ar = attr(ar, /(<meta name="twitter:image:alt" content=")[^"]*"/, AR.meta.og_description);
ar = swap(ar, '<link rel="canonical" href="https://getmeida.com/">', '<link rel="canonical" href="https://getmeida.com/ar/">');
ar = swap(ar, '<meta property="og:url" content="https://getmeida.com/">', '<meta property="og:url" content="https://getmeida.com/ar/">');
ar = swap(ar, '<meta property="og:locale" content="fr_DZ">\n<meta property="og:locale:alternate" content="ar_DZ">',
              '<meta property="og:locale" content="ar_DZ">\n<meta property="og:locale:alternate" content="fr_DZ">');
ar = swap(ar, "/fonts/Inter-Regular.woff2", "/fonts/noto-kufi-arabic-arabic-400-normal.woff2");
ar = swap(ar, "/fonts/InterDisplay-Black.woff2", "/fonts/noto-kufi-arabic-arabic-900-normal.woff2");
ar = swap(ar, '<a class="lang" id="lang" href="/ar/" hreflang="ar" lang="ar"', '<a class="lang" id="lang" href="/" hreflang="fr" lang="fr"');
ar = swap(ar, 'aria-label="Changer de langue / تغيير اللغة">العربية</a>', 'aria-label="Changer de langue / تغيير اللغة">Français</a>');
for (const [fr, tr] of Object.entries(AR.attrs)) ar = ar.split(`aria-label="${fr}"`).join(`aria-label="${tr}"`);

const missing = new Set();
let swapped = 0;
ar = ar.replace(/<(\w+)([^>]*?\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, key, inner) => {
  if (AR.text[key] == null) { missing.add(key); return m; }
  swapped++;
  return `<${tag}${attrs}>${AR.text[key]}</${tag}>`;
});
const total = (src.match(/data-i18n="/g) || []).length;
if (swapped < total * 0.9) throw new Error(`build.mjs: only ${swapped}/${total} texts translated`);
if (missing.size) console.warn(`build.mjs: no Arabic for ${[...missing].join(", ")} (French kept)`);

ar = ar.replace(LD_MARK, jsonLd(ar, "ar-DZ", `${SITE}/ar/`, AR.meta.app_description));
mkdirSync("dist/ar", { recursive: true });
writeFileSync("dist/ar/index.html", stamp(ar));

/* ---------- other pages ---------- */
writeFileSync("dist/404.html", stamp(readFileSync("public/404.html", "utf8")));

console.log(`build.mjs: dist/ ready (${swapped}/${total} Arabic texts, css ${ver["/style.css"]}, js ${ver["/script.js"]})`);
