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

const parseAttributes = (brandLine: string) => {
  const rawAttributes = brandLine.split("||").map((attr) => attr.trim());
  const brand = rawAttributes[0];
  const sites: { name: string; url: string }[] = [];
  rawAttributes.slice(1).forEach((attr) => {
    const [attrType, ...attrValues] = attr.split(":");
    switch (attrType) {
      case "site":
        const [name, ...urlRest] = attrValues;
        sites.push({ name, url: urlRest.join(":") });
        break;
      default:
        throw new Error(`Unrecognized attribute type ${attrType}`);
    }
  });

  return { brand, sites };
};

export const generateBrands = () => {
  const brandMap: { [key: string]: Brand } = {};
  brands.forEach((brandLine) => {
    const { brand, sites } = parseAttributes(brandLine);
    const slug = escapeURL(brand);
    const subscribers = Math.round(
      getRandomInRange(MIN_SUBSCRIBERS, MAX_SUBSCRIBERS)
    );
    const picture: Picture = {
      invert: getRandom() <= CHANCE_TO_INVERT_PICTURE,
      fileName: photoGenerator.next().value,
    };
    brandMap[slug] = {
      slug,
      name: brand,
      description: brandDescriptionGenerator.next().value,
      picture,
      subscribers,
      sites,
    };
  });
  return brandMap;
};
