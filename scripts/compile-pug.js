const fs = require("fs");
const path = require("path");
const pug = require("pug");
const { buildGlobalContext } = require("./shared/data");

// Paths
const VIEWS_DIR = path.resolve(__dirname, "..", "src", "views");
const OUTPUT_DIR = path.resolve(__dirname, "..", "dist");

const buildViews = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const globalContext = buildGlobalContext();

  const pugFileNames = fs
    .readdirSync(VIEWS_DIR)
    .filter((file) => file.includes(".pug"))
    .map((view) => view.split(".pug")[0]);

  pugFileNames
    .map((viewName) => {
      const fileName = path.resolve(VIEWS_DIR, `${viewName}.pug`);
      const doctype = viewName === "sitemap" ? "xml" : "html";
      return {
        name: viewName,
        content: pug.renderFile(fileName, {
          ...globalContext,
          pretty: true,
          doctype,
        }),
        extension: doctype,
      };
    })
    .map(({ name, content, extension }) => {
      const fileName = path.resolve(OUTPUT_DIR, `${name}.${extension}`);
      fs.writeFileSync(fileName, content);
    });

  return pugFileNames;
};

buildViews();
