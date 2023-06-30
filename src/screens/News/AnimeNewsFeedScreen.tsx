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
  const [selectedType, setSelectedType] =
    useState<AnimeNewsVariables['type']>('undefined');
  const [selectedSort, setSelectedSort] =
    useState<AnimeNewsVariables['sort']>('undefined');
  const [selectedStatus, setSelectedStatus] =
    useState<AnimeNewsVariables['status']>('undefined');
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
      sort: selectedSort === 'undefined' ? undefined : selectedSort,
      type: selectedType === 'undefined' ? undefined : selectedType,
      status: selectedStatus === 'undefined' ? undefined : selectedStatus,
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

  const handleTypeChange = (type: AnimeNewsVariables['type']) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleSortChange = (sort: AnimeNewsVariables['sort']) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const handleStatusChange = (status: AnimeNewsVariables['status']) => {
    setSelectedStatus(status);
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
    { label: 'All', value: 'undefined' },
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Romance', value: 'Romance' },
  ];

  const sortOptions = [
    { label: 'Default', value: 'undefined' },
    { label: 'Title (A-Z)', value: 'TITLE_ROMAJI' },
    { label: 'Title (Z-A)', value: 'TITLE_ROMAJI_DESC' },
    { label: 'Start Date (Newest)', value: 'START_DATE' },
    { label: 'Start Date (Oldest)', value: 'START_DATE_DESC' },
    { label: 'End Date (Newest)', value: 'END_DATE' },
    { label: 'End Date (Oldest)', value: 'END_DATE_DESC' },
    { label: 'Episodes (Most)', value: 'EPISODES' },
    { label: 'Episodes (Least)', value: 'EPISODES_DESC' },
    { label: 'Popularity', value: 'POPULARITY' },
    { label: 'Trending', value: 'TRENDING' },
  ];

  const statusOptions = [
    { label: 'All', value: 'undefined' },
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Releasing', value: 'RELEASING' },
    { label: 'Not Yet Released', value: 'NOT_YET_RELEASED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Hiatus', value: 'HIATUS' },
  ];
  const typeOptions = [
    { label: 'All', value: 'undefined' },
    { label: 'Anime', value: 'ANIME' },
    { label: 'Manga', value: 'MANGA' },
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
          <Text style={styles.source}>Source: {item.source}</Text>
          <Text style={styles.episodes}>Episodes: {item.episodes}</Text>
          <Text style={styles.startDate}>
            Start Date: {item.startDate.year}
          </Text>
          <Text style={styles.endDate}>End Date: {item.endDate.year}</Text>
          <TouchableOpacity>
            <Image
              style={styles.trailerThumbnail}
              source={{ uri: item.trailer?.thumbnail }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Genre:</Text>
        <RNPickerSelect
          onValueChange={handleGenreChange}
          items={genreOptions}
          value={selectedGenre}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Genre', value: 'All' }}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Type:</Text>
        <RNPickerSelect
          onValueChange={handleTypeChange}
          items={typeOptions}
          value={selectedType}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Type', value: 'undefined' }}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort By:</Text>
        <RNPickerSelect
          onValueChange={handleSortChange}
          items={sortOptions}
          value={selectedSort}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Sort', value: 'undefined' }}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Status:</Text>
        <RNPickerSelect
          onValueChange={handleStatusChange}
          items={statusOptions}
          value={selectedStatus}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Status', value: 'undefined' }}
        />
      </View>

      <FlatList
        data={newsData}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.lightGrayPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  readMore: {
    color: 'blue',
    marginTop: 5,
  },
  genres: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  source: {
    marginBottom: 5,
  },
  episodes: {
    marginBottom: 5,
  },
  startDate: {
    marginBottom: 5,
  },
  endDate: {
    marginBottom: 5,
  },
  trailerThumbnail: {
    width: 200,
    height: 100,
    resizeMode: 'cover',
  },
});

export default AnimeNewsFeedScreen;