import { brands, photos } from "../shared/rawData";
import {
  createArrayGenerator,
  escapeURL,
  getRandom,
  getRandomInRange,
} from "../shared/utils";

const CHANCE_TO_INVERT_PICTURE = 0.3;
const MIN_SUBSCRIBERS = 15;
const MAX_SUBSCRIBERS = 5e5;

const photoGenerator = createArrayGenerator(photos);

export const generateBrands = () => {
  const brandMap: { [key: string]: Brand } = {};
  brands.forEach((brand) => {
    const slug = escapeURL(brand);
    const subscribers = Math.round(
      getRandomInRange(MIN_SUBSCRIBERS, MAX_SUBSCRIBERS)
    );
    const picture: Picture = {
      invert: getRandom() <= CHANCE_TO_INVERT_PICTURE,
      fileName: String(photoGenerator.next().value),
    };
    brandMap[slug] = {
      slug,
      name: brand,
      picture,
      subscribers,
    };
  });
  return brandMap;
};
