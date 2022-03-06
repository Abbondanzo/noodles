const fs = require("fs");
const http = require("http");
const { Server } = require("node-static");
const path = require("path");
const pug = require("pug");
const { buildGlobalContext } = require("./shared/data");

const VIEWS_PATH = path.join(__dirname, "..", "src", "views");
const SRC_PATH = path.join(__dirname, "..", "src");
const DIST_PATH = path.join(__dirname, "..", "dist");
const PORT = 3000;

const assetServer = new Server(path.join(__dirname, "..", "src"));
const distServer = new Server(path.join(__dirname, "..", "dist"));
const noodPhotoServer = new Server(
  path.join(__dirname, "..", "data", "photos")
);

try {
  http
    .createServer((req, res) => {
      console.info(req.method, req.url);
      const reqUrl = req.url.match(/\/$/) ? `${req.url}index` : req.url;
      if (fs.existsSync(path.join(VIEWS_PATH, `${reqUrl}.pug`))) {
        res.writeHead(200, { "Content-Type": "text/html" });
        const globalContext = buildGlobalContext();
        const pugFile = path.join(VIEWS_PATH, `${reqUrl}.pug`);
        res.end(pug.renderFile(pugFile, globalContext));
      } else if (req.url.startsWith("/assets/img/noods")) {
        req
          .addListener("end", () => {
            req.url = req.url.split("/assets/img/noods")[1];
            noodPhotoServer.serve(req, res);
          })
          .resume();
      } else if (req.url.startsWith("/assets")) {
        req
          .addListener("end", () => {
            assetServer.serve(req, res);
          })
          .resume();
      } else {
        req
          .addListener("end", () => {
            distServer.serve(req, res);
          })
          .resume();
      }
    })
    .listen(PORT);
  console.log(`Listening on port ${PORT}`);
} catch (e) {
  throw new Error(e);
}
