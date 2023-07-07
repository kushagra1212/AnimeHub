import { gql } from '@apollo/client';

export const GET_ANIMES_USING_SEARCH = gql`
  query SearchAnime(
    $search: String
    $type: MediaType
    $page: Int
    $perPage: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: $type) {
        id
        title {
          english
        }
        bannerImage
        genres
        tags {
          name
        }
        rankings {
          type
          format
          allTime
          id
        }
        coverImage {
          extraLarge
        }
      }
      pageInfo {
        hasNextPage
        currentPage
      }
    }
  }
`;
export const GET_ANIME_DETAILS = gql`
  query Query($mediaId: Int) {
    Media(id: $mediaId) {
      bannerImage
      chapters
      characters {
        nodes {
          id
          age
          bloodType
          gender
          image {
            medium
          }
          isFavourite
          name {
            full
          }
        }
      }
      averageScore
      coverImage {
        extraLarge
      }
      description(asHtml: true)
      duration
      endDate {
        day
        month
        year
      }
      episodes
      format
      genres
      hashtag
      id
      isAdult
      idMal
      meanScore
      popularity
      nextAiringEpisode {
        episode
        id
      }
      title {
        english
      }
      volumes
      updatedAt
      type
      trending
      trailer {
        site
        thumbnail
      }
      studios {
        nodes {
          name
        }
      }
      startDate {
        month
        day
        year
      }
      staff {
        edges {
          node {
            image {
              medium
            }
            id
            gender
          }
        }
      }
      season
      rankings {
        context
        id
        rank
      }
    }
  }
`;
