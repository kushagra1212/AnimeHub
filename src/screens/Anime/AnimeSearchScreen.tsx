import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { useQuery } from '@apollo/client';

import AnimeCard from '../../components/molecules/AnimeCard';
import Search from '../../components/molecules/Search';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIMES_USING_SEARCH } from '../../graphql/queries/anime-queries';
import { SearchInput } from '../../components/ui-components/SearchInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH, tabBarStyle } from '../../utils';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import Background from '../../components/ui-components/Background';
import Shadder from '../../components/ui-components/Shadder';

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

  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (data && !animeResponse && !loading && !isLoading) {
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

  const handleSearchSubmit = () => {};
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
    if (
      animeResponse &&
      !isLoading &&
      animeResponse.pageInfo.hasNextPage &&
      !loading
    ) {
      setIsloading(true);
      fetchMore({
        variables: {
          page: animeResponse.pageInfo.currentPage + 1,
        },
      })
        .then((res) => {
          setAnimeResponse((prev) => {
            return {
              pageInfo: res.data.Page.pageInfo,
              animes: [...prev.animes, ...res.data.Page.media],
            };
          });
        })
        .catch((err) => {
          console.log(err, 'Anime Response Error: AnimeSearchScreen');
        })
        .finally(() => {
          setIsloading(false);
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
          zIndex={100}
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

        {(!animeResponse || animeResponse.animes.length == 0) &&
        searchText &&
        searchText !== '' &&
        !loading ? (
          <View style={styles.noresults}>
            <Text style={styles.message}>No results found</Text>
          </View>
        ) : null}
        {(!animeResponse || animeResponse.animes.length === 0) &&
        searchText === '' &&
        !loading ? (
          <View style={styles.noresults}>
            <Text style={styles.message}>Search Anime Here</Text>
          </View>
        ) : null}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0DD9FA" />
          </View>
        ) : null}

        {animeResponse && queryText && queryText !== '' ? (
          <View
            style={{
              flex: 1,
              height: 800,
              marginTop: 100,
              marginBottom: 50,
            }}
          >
            <Shadder />
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
    height: WINDOW_HEIGHT,
  },
  message: {
    fontSize: 28,
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: 'extra-bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  noresults: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: WINDOW_HEIGHT,
    position: 'absolute',
    width: WINDOW_WIDTH,
  },
});

export default AnimeSearchScreen;
