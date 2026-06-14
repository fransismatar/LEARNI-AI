import { travelStories } from "./travelStories";
import { dailyLifeStories } from "./dailyLifeStories";
import { businessStories } from "./businessStories";
import { careerStories } from "./careerStories";
import { socialStories } from "./socialStories";
import { studyStories } from "./studyStories";

export const storyLessons = [
  ...travelStories,
  ...dailyLifeStories,
  ...businessStories,
  ...careerStories,
  ...socialStories,
  ...studyStories,
];

export {
  travelStories,
  dailyLifeStories,
  businessStories,
  careerStories,
  socialStories,
  studyStories,
};