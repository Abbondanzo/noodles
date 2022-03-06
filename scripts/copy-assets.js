const fs = require("fs");
const path = require("path");

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

const copyNoodPhotos = () => {
  const noodsSourceDir = path.join(ROOT_DIR, "data", "photos");
  const noodsTargetDir = path.join(ROOT_DIR, "dist", "assets", "img", "noods");
  return copyRecursive(noodsSourceDir, noodsTargetDir);
};

const copySrcAssets = () => {
  const assetsSourceDir = path.join(ROOT_DIR, "src", "assets");
  const assetsTargetDir = path.join(ROOT_DIR, "dist", "assets");
  return copyRecursive(assetsSourceDir, assetsTargetDir);
};

let copiedFiles = 0;
copiedFiles += copyNoodPhotos();
copiedFiles += copySrcAssets();
console.log(`Copied ${copiedFiles} files`);
