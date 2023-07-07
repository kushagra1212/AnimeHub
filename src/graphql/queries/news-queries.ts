import { gql } from '@apollo/client';

export const GET_NEWS_DETAILS = gql`
  query GetMediaDetails($mediaId: Int) {
    Media(id: $mediaId) {
      id
      title {
        english
      }
      coverImage {
        extraLarge
      }
      description
      genres
      source
      episodes
      startDate {
        year
      }
      endDate {
        year
      }
      trailer {
        id
        site
        thumbnail
      }
      staff {
        edges {
          node {
            id
            name {
              full
            }
          }
        }
      }
      studios {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;
export const GET_ANIME_NEWS = gql`
  query GetAnimeNews(
    $genre: String
    $page: Int
    $perPage: Int
    $type: MediaType
    $status: MediaStatus
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
      }
      media(genre: $genre, type: $type, status: $status, sort: $sort) {
        id
        title {
          english
        }
        coverImage {
          extraLarge
        }
        description
        genres
        source
        episodes
        startDate {
          year
        }
        endDate {
          year
        }
      }
    }
  }
`;
