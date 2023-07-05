import React, { useEffect, useState } from 'react';
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
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS, SIZES } from '../../theme';
import CircularButton from '../../components/ui-components/CircularButton';

import Background from '../../components/ui-components/Background';
import NewsCard from '../../components/organs/NewsCard';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { GET_ANIME_NEWS } from '../../graphql/queries/news-queries';
import { LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
const { width, height: SCREEEN_HEIGHT } = Dimensions.get('window');

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
  const perPage = 10;

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

  let newsData = data?.Page.media || [];

  const pageInfo = data?.Page.pageInfo;
  newsData = Array.from(
    new Map(newsData.map((item) => [item.id, item])).values()
  );
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
  console.log(data?.Page.media.length, 'NewsData');
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
    if (item.title?.english === null) return null;
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
        <TouchableOpacity style={{ zIndex: 100 }} onPress={() => {}}>
          <CircularButton
            canvasHeight={95}
            canvasWidth={95}
            dx={width - 65}
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
        {newsData && newsData?.length ? (
          <View
            style={{
              marginTop: 120,
              height: 800,
              flex: 1,
            }}
          >
            <View
              style={{
                height: 100,
                position: 'absolute',
                width: width,
                zIndex: 1,
              }}
            >
              <View
                style={{
                  height: 200,
                  position: 'absolute',
                  width: '100%',
                  top: -140,
                }}
              >
                <Svg height="100%" width="100%">
                  <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#3E424B" stopOpacity="0.75" />
                    <Stop offset="0.25" stopColor="#3E424B" stopOpacity="1" />
                    <Stop offset="0.75" stopColor="#2E3136" stopOpacity="1" />

                    <Stop offset="0.85" stopColor="#2E3136" stopOpacity="1" />
                    <Stop offset="1" stopColor="#2E3136" stopOpacity="0" />
                  </LinearGradient>
                  <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#fade)"
                  />
                </Svg>
              </View>
            </View>

            <FlashList
              estimatedItemSize={2000}
              data={newsData}
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={2}
            />
          </View>
        ) : null}
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
