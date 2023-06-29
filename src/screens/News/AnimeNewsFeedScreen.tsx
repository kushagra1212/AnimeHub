import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import RenderHTML from 'react-native-render-html';
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS } from '../../theme';

const GET_ANIME_NEWS = gql`
  query GetAnimeNews($genre: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
      }
      media(genre: $genre, type: ANIME) {
        id
        title {
          english
        }
        coverImage {
          medium
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
      }
    }
  }
`;

interface AnimeNewsFeedScreenProps {
  navigation: NativeStackNavigationProp<NewsStackParamList>;
}

const AnimeNewsFeedScreen: React.FC<AnimeNewsFeedScreenProps> = ({
  navigation,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 40;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { loading, error, data, fetchMore } = useQuery<
    AnimeNewsData,
    AnimeNewsVariables
  >(GET_ANIME_NEWS, {
    variables: {
      genre: selectedGenre === 'All' ? undefined : selectedGenre,
      page,
      perPage,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  const newsData = data?.Page.media ?? [];
  const pageInfo = data?.Page.pageInfo;

  const handleNewsItemPress = (item: Media) => {
    navigation.navigate('DetailedNewsScreen', { mediaId: item.id });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: { page: pageInfo.currentPage + 1 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            Page: {
              ...prev.Page,
              media: [
                ...(prev.Page.media ?? []),
                ...(fetchMoreResult?.Page.media ?? []),
              ],
              pageInfo: fetchMoreResult?.Page.pageInfo,
            },
          };
        },
      });
    }
  };

  const genreOptions = [
    { label: 'All', value: 'All' },
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Romance', value: 'Romance' },
  ];

  const renderNewsItem = ({ item }: { item: Media }) => {
    let description = item.description;

    if (!showFullDescription && description.length > 150) {
      description = `${description.slice(0, 150)}...`;
    }
    return (
      <TouchableOpacity onPress={() => handleNewsItemPress(item)}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title.english}</Text>
          <RenderHTML
            contentWidth={200}
            source={{ html: item.description.slice(0, 150) }}
          />
          {/* Render HTML content */}
          {description.length > 150 && (
            <TouchableOpacity onPress={() => handleNewsItemPress(item)}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.genres}>Genres: {item.genres.join(', ')}</Text>
          <Text style={styles.source}>Source: {item.source} </Text>
          <Text style={styles.episodes}>Episodes: {item.episodes}</Text>
          <Text style={styles.startDate}>
            Start Date: {item.startDate.year}
          </Text>
          <Text style={styles.endDate}>End Date: {item.endDate.year}</Text>
          {item.trailer && (
            <TouchableOpacity>
              <Image
                style={styles.thumbnail}
                source={{ uri: item.trailer.thumbnail }}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={handleGenreChange}
        items={genreOptions}
        value={selectedGenre}
        style={pickerSelectStyles}
      />
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          pageInfo?.hasNextPage ? (
            <Button title="Load More" onPress={handleLoadMore} />
          ) : null
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
  genres: {
    fontSize: 16,
    marginBottom: 5,
    color: '#888888',
  },
  source: {
    fontSize: 16,
    marginBottom: 5,
    color: '#888888',
  },
  episodes: {
    fontSize: 16,
    marginBottom: 5,
    color: '#888888',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  startDate: {
    fontSize: 16,
    marginBottom: 5,
    color: '#888888',
  },
  endDate: {
    fontSize: 16,
    marginBottom: 5,
    color: '#888888',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  readMore: {
    color: COLORS.blueSecondary,
    fontSize: 16,
    marginTop: 5,
    opacity: 0.5,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default AnimeNewsFeedScreen;
