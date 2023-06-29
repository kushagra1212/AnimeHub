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
    medium: string;
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
  genre: string;
  page: number;
  perPage: number;
}
