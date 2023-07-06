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
import { memo } from 'react';
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
import BottomSheet, {
  BottomSheetRef,
} from '../../components/molecules/BottomSheet';
import FilterSheet from '../../components/molecules/FilterSheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrNoDupe, tabBarStyle } from '../../utils';
import Shadder from '../../components/ui-components/Shadder';
const { width, height: SCREEEN_HEIGHT } = Dimensions.get('window');

interface AnimeNewsFeedScreenProps {
  navigation: NativeStackNavigationProp<NewsStackParamList>;
}
interface Response {
  pageInfo: {
    hasNextPage: boolean;
    currentPage: number;
  };
  media: Media[];
}
const AnimeNewsFeedScreen: React.FC<AnimeNewsFeedScreenProps> = ({
  navigation,
}) => {
  const sheetRef = React.useRef<BottomSheetRef>(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] =
    useState<AnimeNewsVariables['type']>('undefined');
  const [selectedSort, setSelectedSort] =
    useState<AnimeNewsVariables['sort']>('undefined');
  const [selectedStatus, setSelectedStatus] =
    useState<AnimeNewsVariables['status']>('undefined');

  const [response, setResponse] = useState<Response | null>(null);
  const opacity = useSharedValue(0);
  const perPage = 10;

  const { loading, error, data, fetchMore } = useQuery<
    AnimeNewsData,
    AnimeNewsVariables
  >(GET_ANIME_NEWS, {
    variables: {
      genre: selectedGenre === 'All' ? undefined : selectedGenre,
      page: 1,
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
  useEffect(() => {
    if (data && data?.Page && response === null) {
      setResponse({
        pageInfo: data.Page.pageInfo,
        media: data.Page.media,
      });
    }
  }, [data?.Page?.pageInfo?.currentPage]);

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

  // newsData = Array.from(
  //   new Map(newsData.map((item) => [item.id, item])).values()
  // );
  const handleNewsItemPress = (item: Media) => {
    navigation.navigate('DetailedNewsScreen', { mediaId: item.id });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleTypeChange = (type: AnimeNewsVariables['type']) => {
    setSelectedType(type);
  };

  const handleSortChange = (sort: AnimeNewsVariables['sort']) => {
    setSelectedSort(sort);
  };

  const handleStatusChange = (status: AnimeNewsVariables['status']) => {
    setSelectedStatus(status);
  };

  const handleLoadMore = () => {
    if (response && response.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          page: response.pageInfo.currentPage + 1,
        },
      })
        .then((newData) => {
          setResponse((prev) => {
            return {
              pageInfo: newData.data.Page.pageInfo,
              media: ArrNoDupe([...prev.media, ...newData.data.Page.media]),
            } as Response;
          });
        })
        .catch((err) => console.log(err, 'Handle Load More Error'));
    }
  };
  const bottomSheetToggle = () => {
    if (sheetRef.current?.isActive()) {
      navigation.getParent().setOptions({
        tabBarStyle: { ...tabBarStyle, display: 'flex' },
      });
      opacity.value = 0;
      sheetRef.current?.hideBottomSheet();
    } else {
      navigation.getParent().setOptions({
        tabBarStyle: { ...tabBarStyle, display: 'none' },
      });
      opacity.value = 0.5;
      sheetRef.current?.showBottomSheet();
    }
  };

  const renderNewsItem = ({ item }: { item: Media }) => {
    if (item.title?.english === null) return null;
    return (
      <NewsCard
        item={item}
        handleNewsItemPress={() => handleNewsItemPress(item)}
      />
    );
  };

  const AnimatedBackdropStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 200 }),
      display: opacity.value === 0 ? 'none' : 'flex',
    };
  });
  return (
    <Background>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'black',
              zIndex: 3,
              height: SCREEEN_HEIGHT,
              width: width,
              opacity: 0,
              position: 'absolute',
            },
            AnimatedBackdropStyles,
          ]}
          onTouchStart={bottomSheetToggle}
        />
        <BottomSheet bottomSheetToggle={bottomSheetToggle} ref={sheetRef}>
          <FilterSheet />
        </BottomSheet>
        <View style={{ zIndex: 2 }}>
          <CircularButton
            canvasHeight={95}
            canvasWidth={95}
            dx={width - 65}
            dy={80}
            onPress={bottomSheetToggle}
          />
        </View>

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
        {response ? (
          <View
            style={{
              marginTop: 120,
              height: 500,
              flex: 1,
            }}
          >
            <Shadder />

            <FlashList
              estimatedItemSize={200}
              data={response.media}
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

export default memo(AnimeNewsFeedScreen);
