import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimeStackParamList } from '../../Navigation';
type AnimeDetailsScreenProps = {
  route: {
    params: {
      mediaId: string;
    };
  };
  navigation: NativeStackNavigationProp<AnimeStackParamList>;
};

const GET_ANIME_DETAILS = gql`
  query Query(
    $mediaId: Int
    $limit: Int
    $page: Int
    $perPage: Int
    $sort: [ReviewSort]
  ) {
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
      description
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
      reviews(limit: $limit, page: $page, perPage: $perPage, sort: $sort) {
        edges {
          node {
            body
            id
            user {
              id
              name
              createdAt
              avatar {
                medium
              }
            }
            createdAt
            userId
            mediaId
          }
        }
      }
      rankings {
        context
        id
        rank
      }
    }
  }
`;

const AnimeDetailsScreen: React.FC<AnimeDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { mediaId } = route.params;
  console.log('mediaId', mediaId);
  const { loading, error, data } = useQuery(GET_ANIME_DETAILS, {
    variables: {
      mediaId,
      limit: null,
      page: null,
      perPage: null,
      sort: 'RATING',
    },
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const anime = data?.Media;

  return (
    <View>
      <Image
        source={{ uri: anime.bannerImage }}
        style={{ width: '100%', height: 200 }}
      />
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>Title: {anime.title.english}</Text>
      <Text>Genres: {anime.genres.join(', ')}</Text>
      <Text>Description: {anime.description}</Text>
      <Text>Chapters: {anime.chapters}</Text>
      <Text>Episodes: {anime.episodes}</Text>
      <Text>Format: {anime.format}</Text>
      <Text>Popularity: {anime.popularity}</Text>
      <Text>
        Start Date: {anime.startDate.year}-{anime.startDate.month}-
        {anime.startDate.day}
      </Text>
      <Text>
        End Date: {anime.endDate.year}-{anime.endDate.month}-{anime.endDate.day}
      </Text>
      {/* Render other details of the anime */}
    </View>
  );
};

export default AnimeDetailsScreen;
