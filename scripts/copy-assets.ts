import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT_DIR = path.resolve(__dirname, "..");

const copyRecursive = (source: string, target: string): number => {
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

const compressNoodPhotos = async (
  sourceDir: string,
  targetDir: string,
  width: number,
  height: number
) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  const promises = fs.readdirSync(sourceDir).map((file) => {
    const filePath = path.join(sourceDir, file);
    if (!fs.statSync(filePath).isFile()) {
      return Promise.resolve();
    }
    return sharp(filePath)
      .resize({
        width,
        height,
        fit: sharp.fit.cover,
      })
      .toFile(path.join(targetDir, file));
  });
  await Promise.all(promises);
};

const copyNoodPhotos = async () => {
  const noodsSourceDir = path.join(ROOT_DIR, "data", "photos");
  const noodsTargetDir = path.join(ROOT_DIR, "dist", "assets", "img", "noods");
  const numPhotosCopied = copyRecursive(noodsSourceDir, noodsTargetDir);

  // Compressing files here too
  const noodsMinDir = path.join(noodsTargetDir, "min");
  await compressNoodPhotos(noodsTargetDir, noodsMinDir, 300, 180);
  const noodsProfileDir = path.join(noodsTargetDir, "profile");
  await compressNoodPhotos(noodsTargetDir, noodsProfileDir, 360, 360);

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
