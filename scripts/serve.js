const fs = require("fs");
const http = require("http");
const { Server } = require("node-static");
const path = require("path");
const pug = require("pug");

const VIEWS_PATH = path.join(__dirname, "..", "src", "views");
const SRC_PATH = path.join(__dirname, "..", "src");
const DIST_PATH = path.join(__dirname, "..", "dist");
const PORT = 3000;

const assetServer = new Server(SRC_PATH);
const distServer = new Server(DIST_PATH);

try {
  http
    .createServer((req, res) => {
      console.info(req.method, req.url);
      const reqUrl = req.url.match(/\/$/) ? `${req.url}index` : req.url;
      if (fs.existsSync(path.join(VIEWS_PATH, `${reqUrl}.pug`))) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(pug.renderFile(path.join(VIEWS_PATH, `${reqUrl}.pug`)));
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
