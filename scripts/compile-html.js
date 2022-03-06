const fs = require("fs");
const path = require("path");
const { DATA_FILE_PATH } = require("./shared/data");
const { appRouter } = require("../src/router");

// Paths
const VIEWS_DIR = path.resolve(__dirname, "..", "src", "views");
const OUTPUT_DIR = path.resolve(__dirname, "..", "dist");

const collectRoutes = () => {
  /** @type {Array<string>} */
  const routes = [];

  routes.push(
    ...fs
      .readdirSync(VIEWS_DIR)
      .filter((file) => file.endsWith(".pug"))
      .map((view) => "/" + view.replace(/\.pug$/, ""))
  );

  const dataFile = fs.readFileSync(DATA_FILE_PATH);
  const rawData = JSON.parse(dataFile);

  // All /view/uuid routes by entries
  routes.push(
    ...Object.keys(rawData.entries).map((entryId) => `/view/${entryId}`)
  );

  // All /category/category-name routes by slugs
  routes.push(
    ...Object.keys(rawData.categorySlugs).map(
      (slugKey) => `/category/${rawData.categorySlugs[slugKey]}`
    )
  );

  // All /category/category-name routes by slugs
  routes.push(
    ...Object.keys(rawData.makeSlugs).map(
      (slugKey) => `/make/${rawData.makeSlugs[slugKey]}`
    )
  );

  return routes;
};

const writeFiles = () => {
  // Check that /dist exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const routes = collectRoutes();
  const baseURL = process.env.BASE_URL || "";

  routes.forEach((route) => {
    const doctype = route === "sitemap" ? "xml" : "html";
    const html = appRouter(route, { pretty: true, doctype, baseURL });

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
