import { comments, usernames } from "../shared/rawData";
import { createArrayGenerator, getRandomInRange } from "../shared/utils";

const MIN_COMMENTS = 1;
const MAX_COMMENTS = 7;
const MIN_LIKES = 0;
const MAX_LIKES = 4;

const commentBodyGenerator = createArrayGenerator(comments);
const usernameGenerator = createArrayGenerator(usernames);

export const generateEntryComments = (): EntryComment[] => {
  let numComments = getRandomInRange(MIN_COMMENTS, MAX_COMMENTS);
  const comments: EntryComment[] = [];
  while (numComments > 0) {
    numComments--;
    comments.push({
      username: usernameGenerator.next().value,
      body: commentBodyGenerator.next().value,
      likes: getRandomInRange(MIN_LIKES, MAX_LIKES),
    });
  }
  return comments;
};
