const http = require("http");
const { Server } = require("node-static");
const path = require("path");
const { appRouter } = require("../src/router");

const PORT = 3000;

/**
 * @callback ChainableHandler
 * @param {any} req
 * @param {any} res
 * @returns {boolean} if request is handled
 */

/**
 * Servers Pug files.
 *
 * @returns {ChainableHandler}
 */
const createPugServer = () => {
  return (req, res) => {
    const maybePugRendered = appRouter(req.url);
    if (maybePugRendered) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(maybePugRendered);
      return true;
    }
    return false;
  };
};

/**
 * Serves files from the data/photos directory at root.
 *
 * @returns {ChainableHandler}
 */
const createNoodsServer = () => {
  const noodPhotoServer = new Server(
    path.join(__dirname, "..", "data", "photos")
  );
  return (req, res) => {
    if (req.url.startsWith("/assets/img/noods")) {
      req
        .addListener("end", () => {
          req.url = req.url.split("/assets/img/noods")[1];
          noodPhotoServer.serve(req, res);
        })
        .resume();
      return true;
    }
    return false;
  };
};

/**
 * Serves all assets from the src/assets folder at root.
 *
 * @returns {ChainableHandler}
 */
const createAssetsServer = () => {
  const assetServer = new Server(path.join(__dirname, "..", "src"));
  return (req, res) => {
    if (req.url.startsWith("/assets")) {
      req
        .addListener("end", () => {
          assetServer.serve(req, res);
        })
        .resume();
      return true;
    }
    return false;
  };
};

/**
 * Serves any assets from dist folder at root.
 *
 * @returns {ChainableHandler}
 */
const createDistServer = () => {
  const distServer = new Server(path.join(__dirname, "..", "dist"));
  return (req, res) => {
    req
      .addListener("end", () => {
        distServer.serve(req, res);
      })
      .resume();
    return true;
  };
};

/**
 * Allows you to chain a list of given servers. Will return early on the first server that returns
 * a true value.
 *
 * @param {Array<ChainableHandler>} servers
 * @returns {ChainableHandler}
 */
const serverPipe = (servers) => (req, res) => {
  for (const server of servers) {
    if (server(req, res)) {
      return true;
    }
  }
  return false;
};

try {
  const pugServer = createPugServer();
  const noodsPhotoServer = createNoodsServer();
  const assetsServer = createAssetsServer();
  const distServer = createDistServer();

  const rootServer = serverPipe([
    pugServer,
    noodsPhotoServer,
    assetsServer,
    distServer,
  ]);

  http
    .createServer((req, res) => {
      console.info(req.method, req.url);
      rootServer(req, res);
    })
    .listen(PORT);
  console.log(`Listening on port ${PORT}`);
} catch (e) {
  throw new Error(e);
}
