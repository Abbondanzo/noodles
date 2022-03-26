import { brandDescriptions } from "./../shared/rawData";
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
const brandDescriptionGenerator = createArrayGenerator(brandDescriptions);

export const generateBrands = () => {
  const brandMap: { [key: string]: Brand } = {};
  brands.forEach((brandObject) => {
    const name = brandObject.name;
    const slug = escapeURL(name);
    const subscribers = getRandomInRange(MIN_SUBSCRIBERS, MAX_SUBSCRIBERS);
    const sites: Brand["sites"] = brandObject.sites;
    const picture: Picture = {
      invert: getRandom() <= CHANCE_TO_INVERT_PICTURE,
      fileName: photoGenerator.next().value,
    };

    brandMap[slug] = {
      slug,
      name,
      description: brandDescriptionGenerator.next().value,
      picture,
      subscribers,
      sites,
    };
  });
  return brandMap;
};
