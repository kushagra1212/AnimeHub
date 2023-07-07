import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import AnimeCard from '../../components/molecules/AnimeCard';
import Search from '../../components/molecules/Search';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIMES_USING_SEARCH } from '../../graphql/queries/anime-queries';
import { set } from 'react-native-reanimated';
import { SearchInput } from '../../components/ui-components/SearchInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH, tabBarStyle } from '../../utils';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import Background from '../../components/ui-components/Background';

const AnimeSearchScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const [prevDate, setPrevDate] = useState(Date.now());
  const [queryText, setQueryText] = useState('');
  const [animeResponse, setAnimeResponse] = useState(null);
  const perPage = 10;
  const { loading, data, fetchMore, error } = useQuery(
    GET_ANIMES_USING_SEARCH,
    {
      variables: {
        search: queryText.trim().toLowerCase(),
        type: 'ANIME',
        page: 1,
        perPage: perPage,
      },
    }
  );

  useEffect(() => {
    if (data && data?.Page && data?.Page?.media.length && !animeResponse) {
      setAnimeResponse({
        pageInfo: data.Page.pageInfo,
        animes: data.Page.media,
      });
    }
  }, [data]);

  const goBackHandler = () => {
    navigation.goBack();
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    setAnimeResponse(null);
    if (Date.now() - prevDate > 300) {
      setQueryText(text);
      setPrevDate(Date.now());
    }
  };

  const handleSearchSubmit = () => {
    handleSearch(searchText);
  };
  useEffect(() => {
    if (navigation) {
      navigation.getParent()?.setOptions({
        tabBarStyle: { ...tabBarStyle, display: 'none' },
      });
    }

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
      });
    };
  }, [navigation]);

  const handleLoadMore = () => {
    if (animeResponse && animeResponse.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          page: animeResponse.pageInfo.currentPage + 1,
        },
      })
        .then((res) => {
          setAnimeResponse((prev) => {
            const newAnimes = [
              ...new Map(
                [...prev.animes, ...res.data.Page.media].map((v) => [
                  v.id.toString(),
                  v,
                ])
              ).values(),
            ];

            return {
              pageInfo: res.data.Page.pageInfo,
              animes: newAnimes,
            };
          });
        })
        .catch((err) => {
          console.log(err, 'Anime Response Error: AnimeSearchScreen');
        });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  const Card = ({ item }) => {
    return <AnimeCard item={item} navigation={navigation} />;
  };
  const roundedRectWidth = WINDOW_WIDTH - 50,
    roundedRectHeight = 60,
    canvasWidth = WINDOW_WIDTH,
    canvasHeight = 120;
  return (
    <Background>
      <View style={styles.container}>
        <InwardButtonElevated
          canvasHeight={100}
          canvasWidth={100}
          dx={30}
          dy={80}
          focused={true}
          roundedRectHeight={50}
          roundedRectWidth={50}
          onPress={goBackHandler}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            color={COLORS.white}
            size={30}
            style={{
              marginTop: 50 - 15,
              marginLeft: 50 - 15,
            }}
          />
        </InwardButtonElevated>
        <SearchInput
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          dx={WINDOW_WIDTH / 2 + 30}
          dy={80}
          focused={true}
          roundedRectHeight={roundedRectHeight}
          roundedRectWidth={roundedRectWidth}
        >
          <View
            style={{
              backgroundColor: 'red',
              marginTop: 30,
              display: 'flex',
              flexDirection: 'row',
              width: WINDOW_WIDTH,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Search
              ref={searchInputRef}
              {...{
                goBackHandler,
                searchText,
                handleSearch,
                handleSearchSubmit,
                showBackButton: false,
                placeholder: 'Search for anime',
                containerStyles: {
                  position: 'absolute',
                  width: (8 * roundedRectWidth) / 10,
                  height: (8 * roundedRectHeight) / 10,
                  top: 5,
                  left: 25,
                },
              }}
            />
            <Ionicons
              name="search"
              size={30}
              color={COLORS.GraySecondary}
              style={{
                position: 'absolute',
                top: 15,
                right: 40,
                opacity: 0.8,
              }}
            />
          </View>
        </SearchInput>

        {!animeResponse && searchText && searchText !== '' && !loading ? (
          <Text style={styles.message}>No results found</Text>
        ) : null}
        {!animeResponse && searchText === '' && !loading ? (
          <Text style={styles.message}>Search Anime Here</Text>
        ) : null}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.greenPrimary} />
          </View>
        ) : null}

        {animeResponse && queryText && queryText !== '' ? (
          <View style={{ flex: 1, height: 1000 }}>
            <FlashList
              estimatedItemSize={2000}
              data={animeResponse.animes}
              renderItem={Card}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: WINDOW_HEIGHT / 2 - 100,
    color: COLORS.greenPrimary,
    backgroundColor: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimeSearchScreen;
