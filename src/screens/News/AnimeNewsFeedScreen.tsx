import React, { useEffect, useState } from 'react';
import {
  Shadow,
  RoundedRect,
  Canvas,
  useCanvasRef,
  vec,
  Vertices,
} from '@shopify/react-native-skia';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Dimensions,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import RenderHTML from 'react-native-render-html';
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS, SIZES } from '../../theme';

import { Ionicons, Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import SeatedButton from '../../components/ui-components/SeatedButton';
import StickButton from '../../components/ui-components/StickButton';
import CircularButton from '../../components/ui-components/CircularButton';
import { memo } from 'react';
import Background from '../../components/ui-components/Background';
import NewsCard from '../../components/organs/NewsCard';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

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
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] =
    useState<AnimeNewsVariables['type']>('undefined');
  const [selectedSort, setSelectedSort] =
    useState<AnimeNewsVariables['sort']>('undefined');
  const [selectedStatus, setSelectedStatus] =
    useState<AnimeNewsVariables['status']>('undefined');
  const [page, setPage] = useState(1);
  const perPage = 1;

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
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Code to execute when the screen gains focus (returns to screen)
        console.log('Screen is focused');
      });

      return () => {
        unsubscribe();
        // Code to execute when the screen loses focus
        console.log('Screen lost focus');
      };
    }, [navigation])
  );

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text> Loading...</Text>
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Error: {error.message}</Text>
  //     </View>
  //   );
  // }

  const newsData = data?.Page.media;

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
  console.log({ data }, 'NewsData');
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
  console.log(pageInfo, 'NewsFeed');
  const renderNewsItem = ({ item }: { item: Media }) => {
    return (
      <NewsCard
        item={item}
        handleNewsItemPress={() => handleNewsItemPress(item)}
      />
    );
  };

  return (
    <Background>
      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View></View>
        </Modal>
        <TouchableOpacity onPress={() => {}}>
          <CircularButton
            canvasHeight={90}
            canvasWidth={90}
            dx={width - 60}
            dy={80}
          />
        </TouchableOpacity>

        {/* <View style={styles.filterContainer}>
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
      </View> */}
        {newsData?.length && (
          <View style={{ marginTop: 150, height: 800, flex: 1 }}>
            <FlashList
              estimatedItemSize={2000}
              data={newsData}
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.id}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={2}
            />
          </View>
        )}
      </View>
    </Background>
  );
};

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    color: COLORS.primary,
    paddingRight: 30,
    backgroundColor: COLORS.lightGrayPrimary,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    color: COLORS.primary,
    paddingRight: 30,
    backgroundColor: COLORS.lightGrayPrimary,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
  chevronIcon: {
    color: COLORS.primary,
    fontSize: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
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

  readMore: {
    color: COLORS.primary,
    marginTop: 5,
  },
  genres: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
});

export default AnimeNewsFeedScreen;
