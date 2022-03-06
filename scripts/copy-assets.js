const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = path.resolve(__dirname, "..");

/**
 * @param {string} source
 * @param {string} target
 * @returns {number}
 */
const copyRecursive = (source, target) => {
  if (fs.existsSync(source)) {
    const stats = fs.statSync(source);
    if (stats.isDirectory()) {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      let total = 0;
      fs.readdirSync(source).forEach((item) => {
        total += copyRecursive(
          path.join(source, item),
          path.join(target, item)
        );
      });
      return total;
    } else {
      fs.copyFileSync(source, target);
      return 1;
    }
  }
  return 0;
};

const copyNoodPhotos = async () => {
  const noodsSourceDir = path.join(ROOT_DIR, "data", "photos");
  const noodsTargetDir = path.join(ROOT_DIR, "dist", "assets", "img", "noods");
  const numPhotosCopied = copyRecursive(noodsSourceDir, noodsTargetDir);

  // Compressing files here too
  if (!fs.existsSync(path.join(noodsTargetDir, "min"))) {
    fs.mkdirSync(path.join(noodsTargetDir, "min"));
  }
  const promises = fs.readdirSync(noodsTargetDir).map((file) => {
    const filePath = path.join(noodsTargetDir, file);
    if (!fs.statSync(filePath).isFile()) {
      return Promise.resolve();
    }
    return sharp(filePath)
      .resize({
        width: 300,
        height: 180,
        fit: sharp.fit.cover,
      })
      .toFile(path.join(noodsTargetDir, "min", file));
  });
  await Promise.all(promises);

  return numPhotosCopied;
};

const copySrcAssets = () => {
  const assetsSourceDir = path.join(ROOT_DIR, "src", "assets");
  const assetsTargetDir = path.join(ROOT_DIR, "dist", "assets");
  return copyRecursive(assetsSourceDir, assetsTargetDir);
};

const run = async () => {
  let copiedFiles = 0;
  copiedFiles += await copyNoodPhotos();
  copiedFiles += copySrcAssets();
  console.log(`Copied ${copiedFiles} files`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
