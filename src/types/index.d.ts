import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Title {
  english: string;
}

interface CoverImage {
  medium: string;
}

interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

interface StartDate {
  year: number;
}

interface EndDate {
  year: number;
}

interface Media {
  id: string;
  title: {
    english: string;
  };
  coverImage: {
    extraLarge: string;
  };
  description: string;
  genres: string[];
  source: string;
  episodes: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  staff: {
    edges: {
      node: {
        id: string;
        name: {
          full: string;
        };
      };
    }[];
  };
  studios: {
    edges: {
      node: {
        id: string;
        name: string;
      };
    }[];
  };
}

interface PageInfo {
  hasNextPage: boolean;
  currentPage: number;
}

interface AnimeNewsData {
  Page: {
    pageInfo: PageInfo;
    media: Media[];
  };
}

interface AnimeNewsVariables {
  genre: string | undefined;
  page: number;
  perPage: number;
  sort:
    | 'ID_DESC'
    | 'TITLE_ROMAJI'
    | 'TITLE_ROMAJI_DESC'
    | 'TITLE_ENGLISH'
    | 'TITLE_ENGLISH_DESC'
    | 'TITLE_NATIVE'
    | 'TITLE_NATIVE_DESC'
    | 'TYPE'
    | 'TYPE_DESC'
    | 'FORMAT'
    | 'FORMAT_DESC'
    | 'START_DATE'
    | 'START_DATE_DESC'
    | 'END_DATE'
    | 'END_DATE_DESC'
    | 'SCORE'
    | 'SCORE_DESC'
    | 'POPULARITY'
    | 'POPULARITY_DESC'
    | 'TRENDING'
    | 'TRENDING_DESC'
    | 'EPISODES'
    | 'EPISODES_DESC'
    | 'DURATION'
    | 'DURATION_DESC'
    | 'STATUS'
    | 'STATUS_DESC'
    | 'CHAPTERS'
    | 'CHAPTERS_DESC'
    | 'VOLUMES'
    | 'VOLUMES_DESC'
    | 'UPDATED_AT'
    | 'UPDATED_AT_DESC'
    | 'SEARCH_MATCH'
    | 'FAVOURITES'
    | 'FAVOURITES_DESC'
    | 'undefined';
  type: 'ANIME' | 'MANGA' | 'undefined';
  status:
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS'
    | 'undefined';
}
