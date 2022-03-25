import fs from "fs";
import path from "path";
import router from "../src/router.js";
import { dataOutputFile } from "./shared/paths.mjs";
import { getDirname } from "./shared/utils.mjs";

const dirname = getDirname(import.meta.url);

// Paths
const VIEWS_DIR = path.resolve(dirname, "..", "src", "views");
const OUTPUT_DIR = path.resolve(dirname, "..", "dist");

const collectRoutes = () => {
  /** @type {Array<string>} */
  const routes = [];

  routes.push(
    ...fs
      .readdirSync(VIEWS_DIR)
      .filter((file) => file.endsWith(".pug"))
      .map((view) => "/" + view.replace(/\.pug$/, ""))
  );

  const dataFile = fs.readFileSync(dataOutputFile);
  const rawData = JSON.parse(dataFile);

  // All /view/entrySlug routes
  routes.push(
    ...Object.keys(rawData.entries).map((entrySlug) => `/view/${entrySlug}`)
  );

  // All /category/categorySlug routes
  routes.push(
    ...Object.keys(rawData.categories).map(
      (categorySlug) => `/category/${categorySlug}`
    )
  );

  // All /brand/brandSlug routes
  routes.push(
    ...Object.keys(rawData.brands).map((brandSlug) => `/brand/${brandSlug}`)
  );

  return routes;
};

const writeFiles = () => {
  // Check that /dist exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const routes = collectRoutes();
  let baseURL = process.env.BASE_URL || "/";
  // Trim ending slash, we append our own everywhere
  if (baseURL.endsWith("/")) {
    baseURL = baseURL.substring(0, baseURL.length - 1);
  }

  routes.forEach((route) => {
    const doctype = route === "sitemap" ? "xml" : "html";
    const html = router.appRouter(route, { pretty: true, doctype, baseURL });

    if (!html) {
      console.log(`No HTML content served by route ${route}. Skipping...`);
      return;
    }

    const fileName = path.join(OUTPUT_DIR, `${route}.${doctype}`);
    const parentDir = path.join(fileName, "..");
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir);
    }
    fs.writeFileSync(fileName, html);
  });
};

writeFiles();
