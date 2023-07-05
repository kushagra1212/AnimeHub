import { gql } from '@apollo/client';

export const GET_CHARACTER_USING_SEARCH = gql`
  query Query(
    $page: Int
    $perPage: Int
    $sort: [CharacterSort]
    $search: String
  ) {
    Page(page: $page, perPage: $perPage) {
      characters(sort: $sort, search: $search) {
        age
        bloodType
        favourites
        gender
        id
        image {
          large
        }
        name {
          full
        }
      }
      pageInfo {
        currentPage
        hasNextPage
        lastPage
      }
    }
  }
`;

export const GET_CHARACTER_DETAILS = gql`
  query Query($characterId: Int) {
    Character(id: $characterId) {
      description
      favourites
      gender
      id
      image {
        large
      }
      name {
        full
      }
      media {
        nodes {
          coverImage {
            extraLarge
          }
        }
      }
      age
      bloodType
    }
  }
`;
