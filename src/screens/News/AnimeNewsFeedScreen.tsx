import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { memo } from 'react';
import { useQuery } from '@apollo/client';
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS } from '../../theme';
import CircularButton from '../../components/ui-components/CircularButton';

import Background from '../../components/ui-components/Background';
import NewsCard from '../../components/organs/NewsCard';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIME_NEWS } from '../../graphql/queries/news-queries';
import BottomSheet, {
  BottomSheetRef,
} from '../../components/molecules/BottomSheet';
import FilterSheet from '../../components/molecules/FilterSheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tabBarStyle } from '../../utils';
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
  const [selectedGenre, setSelectedGenre] = useState(undefined);
  const [selectedType, setSelectedType] =
    useState<AnimeNewsVariables['type']>(undefined);
  const [selectedSort, setSelectedSort] =
    useState<AnimeNewsVariables['sort']>(undefined);
  const [selectedStatus, setSelectedStatus] =
    useState<AnimeNewsVariables['status']>(undefined);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const opacity = useSharedValue(0);
  const perPage = 10;

  const { data, fetchMore, loading, error } = useQuery<
    AnimeNewsData,
    AnimeNewsVariables
  >(GET_ANIME_NEWS, {
    variables: {
      genre: selectedGenre,
      page: 1,
      perPage,
      sort: selectedSort,
      type: selectedType,
      status: selectedStatus,
    },
  });

  const AnimatedBackdropStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 200 }),
      display: opacity.value === 0 ? 'none' : 'flex',
    };
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = navigation.addListener('focus', () => {
  //       // Code to execute when the screen gains focus (returns to screen)
  //       console.log('Screen is focused');
  //     });

  //     return () => {
  //       unsubscribe();
  //       // Code to execute when the screen loses focus
  //       console.log('Screen lost focus');
  //     };
  //   }, [navigation])
  // );

  const handleNewsItemPress = (item: Media) => {
    setShowBottomSheet(false);
    navigation.navigate('DetailedNewsScreen', { mediaId: item.id });
  };

  const handleGenreChange = (genre: string) => {
    setResponse(null);
    setSelectedGenre(genre);
  };

  const handleTypeChange = (type: AnimeNewsVariables['type']) => {
    setResponse(null);
    setSelectedType(type);
  };

  const handleSortChange = (sort: AnimeNewsVariables['sort']) => {
    setResponse(null);
    setSelectedSort(sort);
  };

  const handleStatusChange = (status: AnimeNewsVariables['status']) => {
    setResponse(null);
    setSelectedStatus(status);
  };

  const handleLoadMore = () => {
    if (!response?.pageInfo.hasNextPage) return;

    if (!isLoading) {
      setIsLoading(true);
      fetchMore({
        variables: {
          page: response?.pageInfo.currentPage + 1,
          perPage,
        },
      })
        .then((res) => {
          setResponse({
            pageInfo: res.data.Page.pageInfo,
            media: [...response.media, ...res.data.Page.media],
          });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const bottomSheetToggle = () => {
    if (sheetRef.current?.isActive()) {
      sheetRef.current?.hideBottomSheet();
      navigation.getParent().setOptions({
        tabBarStyle: { ...tabBarStyle, display: 'flex' },
      });
      opacity.value = 0;
      setTimeout(() => {
        setShowBottomSheet(false);
      }, 500);
    } else {
      setShowBottomSheet(true);
      setTimeout(() => {
        sheetRef.current?.showBottomSheet();
        opacity.value = 0.5;
        navigation.getParent().setOptions({
          tabBarStyle: { ...tabBarStyle, display: 'none' },
        });
      }, 100);
    }
  };

  useEffect(() => {
    if (!response && data) {
      setResponse({
        pageInfo: data.Page.pageInfo,
        media: data.Page.media,
      });
    }
  }, [data]);

  if (error) {
    return <View>Something went wrong</View>;
  }
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
          onTouchStart={() => {
            bottomSheetToggle();
          }}
        />

        {loading ? (
          <Image
            source={require('../../../assets/loader.gif')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: width,
              height: SCREEEN_HEIGHT,
              zIndex: 1,
            }}
          />
        ) : null}

        {showBottomSheet ? (
          <BottomSheet bottomSheetToggle={bottomSheetToggle} ref={sheetRef}>
            <FilterSheet
              {...{
                handleGenreChange,
                selectedGenre,
                handleTypeChange,
                selectedType,
                handleSortChange,
                selectedSort,
                handleStatusChange,
                selectedStatus,
              }}
            />
          </BottomSheet>
        ) : null}
        <View style={{ zIndex: 2 }}>
          <CircularButton
            canvasHeight={95}
            canvasWidth={95}
            dx={width - 65}
            dy={80}
            onPress={bottomSheetToggle}
          />
        </View>

        <View
          style={{
            marginTop: 120,
            height: 800,
            flex: 1,
            paddingBottom: 25,
          }}
        >
          <Shadder />
          {response ? (
            <FlashList
              estimatedItemSize={2000}
              data={response.media}
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          ) : null}
        </View>
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
