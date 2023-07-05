import { Stop } from 'react-native-svg';
export const throttleFunc = (func, interval) => {
  let prevDate = Date.now();
  return function (...args) {
    if (Date.now() - prevDate >= interval) {
      func(args);
      prevDate = Date.now();
    }
  };
};

export const genreOptions = [
  { label: 'All', value: 'All' },
  { label: 'Action', value: 'Action' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Romance', value: 'Romance' },
];

export const sortOptions = [
  { label: 'Default', value: 'undefined' },
  { label: 'Title (A-Z)', value: 'TITLE_ENGLISH' },
  { label: 'Start Date (Oldest)', value: 'START_DATE' },
  { label: 'Start Date (Newest)', value: 'START_DATE_DESC' },
  { label: 'End Date (Oldest)', value: 'END_DATE' },
  { label: 'End Date (Newest)', value: 'END_DATE_DESC' },
  { label: 'Episodes (Most)', value: 'EPISODES' },
  { label: 'Episodes (Least)', value: 'EPISODES_DESC' },
  { label: 'Popularity', value: 'POPULARITY' },
  { label: 'Trending', value: 'TRENDING' },
];

export const statusOptions = [
  { label: 'All', value: 'undefined' },
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Releasing', value: 'RELEASING' },
  { label: 'Not Yet Released', value: 'NOT_YET_RELEASED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Hiatus', value: 'HIATUS' },
];
export const typeOptions = [
  { label: 'All', value: 'undefined' },
  { label: 'Anime', value: 'ANIME' },
  { label: 'Manga', value: 'MANGA' },
];
export const typeOptionsCharacter = [
  { label: 'Most Favourites ', value: 'FAVOURITES_DESC' },
  {
    label: 'Least Favourites ',
    value: 'FAVOURITES',
  },
];
export const LOAD_FONTS = {
  'bold-itatic': require('../../assets/fonts/JetBrainsMono-BoldItalic.ttf'),
  medium: require('../../assets/fonts/JetBrainsMono-Medium.ttf'),
  'semi-bold': require('../../assets/fonts/JetBrainsMono-SemiBold.ttf'),
  regular: require('../../assets/fonts/JetBrainsMonoNL-Regular.ttf'),
  thin: require('../../assets/fonts/JetBrainsMonoNL-Thin.ttf'),
  'extra-light': require('../../assets/fonts/JetBrainsMonoNL-ExtraLight.ttf'),
  'extra-bold': require('../../assets/fonts/JetBrainsMonoNL-ExtraBold.ttf'),
};
