import { getRandomInRange } from "../shared/utils.mjs";

const MIN_VIEWS = 1e5;
const MAX_VIEWS = 4.5e6;
const MIN_DAYS_UPLOADED = 1;
const MAX_DAYS_UPLOADED = 30 * 9;
const MIN_LIKE_RATIO = 0.7;
const MAX_LIKE_RATIO = 0.99;
const MIN_LIKES = 150;
const MAX_LIKES = 5e3;
const MIN_FAVORITES = 50;
const MAX_FAVORITES = 1.5e3;

/**
 * @typedef Stats
 * @property {string} uploadTime
 * @property {number} views
 * @property {number} likes
 * @property {number} dislikes
 * @property {number} favorites
 */

const generateRandomUploadTime = () => {
  const daysAgo = getRandomInRange(MIN_DAYS_UPLOADED, MAX_DAYS_UPLOADED);
  if (daysAgo > 30) {
    const months = Math.round(daysAgo / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const days = Math.round(daysAgo);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
};

/** @returns {Stats} */
export const generateStats = () => {
  const views = getRandomInRange(MIN_VIEWS, MAX_VIEWS);
  const likes = getRandomInRange(MIN_LIKES, MAX_LIKES);
  const likeRatio = getRandomInRange(MIN_LIKE_RATIO, MAX_LIKE_RATIO, false);
  const dislikes = Math.round(likes / likeRatio - likes);
  const favorites = getRandomInRange(MIN_FAVORITES, MAX_FAVORITES);
  return {
    uploadTime: generateRandomUploadTime(),
    views,
    likes,
    dislikes,
    favorites,
  };
};
