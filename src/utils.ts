import path from "path";

const VIEW_ROOT_DIR = path.join(__dirname, "views");

export const getPugFile = (route: string) => {
  return path.join(VIEW_ROOT_DIR, `${route}.pug`);
};

export const getTopBrands = (context: Data): Brand[] => {
  const numTopBrands = 4;
  return Object.keys(context.brands)
    .map((brandSlug) => context.brands[brandSlug])
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, numTopBrands);
};
