import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://zenimes.onrender.com";
const API_BASE = "https://desidubanime-api.onrender.com/api";
const SITEMAP_PATH = path.join(__dirname, "../public/sitemap.xml");

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on("error", () => resolve(null));
  });
}

async function generateSitemap() {
  console.log("Generating sitemap.xml from backend API:", API_BASE);
  const urls = new Set();
  const currentDate = new Date().toISOString();

  // 1. Add Core Static Routes
  const staticRoutes = [
    "/",
    "/home",
    "/most-popular",
    "/top-airing",
    "/completed",
    "/recently-updated",
    "/recently-added",
    "/top-upcoming",
    "/az-list"
  ];
  staticRoutes.forEach((route) => urls.add({ loc: `${DOMAIN}${route}`, priority: "1.00" }));

  // 2. Fetch Home Data
  const homeData = await fetchJson(`${API_BASE}/home`);
  if (homeData) {
    const collections = [
      homeData.spotlights,
      homeData.latest_episodes,
      homeData.top_airing,
      homeData.most_popular,
      homeData.completed_series,
      homeData.latest_movies,
      homeData.upcoming,
      homeData.popular_today,
      homeData.popular_weekly,
      homeData.popular_monthly
    ];

    collections.forEach((col) => {
      if (Array.isArray(col)) {
        col.forEach((item) => {
          const slug = item.slug || item.id;
          if (slug) {
            urls.add({ loc: `${DOMAIN}/${slug}`, priority: "0.80" });
            urls.add({ loc: `${DOMAIN}/watch/${slug}`, priority: "0.70" });
          }
        });
      }
    });

    // Add Genres
    if (Array.isArray(homeData.genres)) {
      homeData.genres.forEach((genre) => {
        const genreSlug = typeof genre === "string" ? genre : genre.id || genre.name;
        if (genreSlug) {
          const formattedGenre = genreSlug.toLowerCase().replace(/\s+/g, "-");
          urls.add({ loc: `${DOMAIN}/genre/${formattedGenre}`, priority: "0.70" });
        }
      });
    }
  }

  // 3. Fetch Popular and Top Airing pages for more anime entries
  const pagesToFetch = [
    `${API_BASE}/category/most-popular?page=1`,
    `${API_BASE}/category/most-popular?page=2`,
    `${API_BASE}/category/top-airing?page=1`,
    `${API_BASE}/category/top-airing?page=2`,
    `${API_BASE}/category/completed?page=1`
  ];

  for (const pageUrl of pagesToFetch) {
    const pageData = await fetchJson(pageUrl);
    if (pageData && Array.isArray(pageData.animes)) {
      pageData.animes.forEach((item) => {
        const slug = item.slug || item.id;
        if (slug) {
          urls.add({ loc: `${DOMAIN}/${slug}`, priority: "0.80" });
          urls.add({ loc: `${DOMAIN}/watch/${slug}`, priority: "0.70" });
        }
      });
    }
  }

  // Convert Set to Array and build XML
  const urlEntries = Array.from(urls);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xml, "utf8");
  console.log(`Successfully generated sitemap.xml with ${urlEntries.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
