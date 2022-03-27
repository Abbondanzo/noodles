import http from "http";
import { Server } from "node-static";
import path from "path";
import { appRouter } from "../src/router";

const PORT = 3000;

/**
 * @callback ChainableHandler
 * @param {any} req
 * @param {any} res
 * @returns {boolean} if request is handled
 */

type ChainableHandler = (req: any, res: any) => boolean;

/**
 * Servers Pug files.
 */
const createPugServer = (): ChainableHandler => {
  return (req, res) => {
    try {
      const maybePugRendered = appRouter(req.url);
      if (maybePugRendered) {
        res.writeHead(200, {
          "Content-Type": req.url === "/sitemap" ? "text/xml" : "text/html",
        });
        res.end(maybePugRendered);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end();
      return true;
    }
  };
};

/**
 * Serves files from the data/photos directory at root.
 */
const createNoodsServer = (): ChainableHandler => {
  const noodPhotoServer = new Server(
    path.join(__dirname, "..", "data", "photos")
  );
  return (req, res) => {
    if (req.url.startsWith("/assets/img/noods")) {
      req
        .addListener("end", () => {
          req.url = req.url.split("/assets/img/noods")[1];
          req.url = req.url.replace("/min", "");
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
 */
const createAssetsServer = (): ChainableHandler => {
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
 */
const createDistServer = (): ChainableHandler => {
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
 */
const serverPipe =
  (servers: ChainableHandler[]): ChainableHandler =>
  (req, res) => {
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
} catch (e: any) {
  throw new Error(e);
}
