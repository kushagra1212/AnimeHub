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
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import AnimeCard from '../../components/molecules/AnimeCard';
import Search from '../../components/molecules/Search';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIMES_USING_SEARCH } from '../../graphql/queries/anime-queries';
import { set } from 'react-native-reanimated';

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
        tabBarStyle: {
          display: 'none',
        },
      });
    }

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
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
            return {
              pageInfo: res.data.Page.pageInfo,
              animes: [...prev.animes, ...res.data.Page.media],
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
  return (
    <View style={styles.container}>
      <Search
        ref={searchInputRef}
        {...{
          goBackHandler,
          searchText,
          handleSearch,
          handleSearchSubmit,
          showBackButton: true,
          placeholder: 'Search Anime',
        }}
      />
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
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  message: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
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
