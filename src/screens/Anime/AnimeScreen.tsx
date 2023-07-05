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
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { throttleFunc } from '../../utils';
import AnimeSearch from '../../components/molecules/Search';
import AnimeCard from '../../components/molecules/AnimeCard';
import { useFocusEffect } from '@react-navigation/native';
import Search from '../../components/molecules/Search';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIMES_USING_SEARCH } from '../../graphql/queries/anime-queries';

const AnimeScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);

  const page = 1;
  const perPage = 10;
  const [animeResponse, setAnimeResponse] = useState(null);
  const { loading, data, fetchMore, error } = useQuery(
    GET_ANIMES_USING_SEARCH,
    {
      variables: {
        type: 'ANIME',
        page: page,
        perPage: perPage,
      },
    }
  );

  const goBackHandler = () => {};

  const handleSearch = (text: string) => {};

  const handleSearchSubmit = () => {};

  const handleLoadMore = () => {
    if (animeResponse && animeResponse.pageInfo?.hasNextPage) {
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
        .catch((err) => console.log(err, 'Anime Response'));
    }
  };

  useEffect(() => {
    if (data && data?.Page && !animeResponse) {
      setAnimeResponse({
        pageInfo: data.Page.pageInfo,
        animes: data.Page.media,
      });
    }
  }, [data]);
  const Card = ({ item }) => {
    return <AnimeCard item={item} navigation={navigation} />;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          backgroundColor: COLORS.black,
        }}
      >
        <View
          onTouchStart={() => navigation.navigate('AnimeSearchScreen')}
          style={{
            backgroundColor: COLORS.redPrimary,
            zIndex: 10000,
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
          }}
        ></View>
        <Search
          ref={searchInputRef}
          {...{
            goBackHandler,
            searchText: '',
            handleSearch,
            handleSearchSubmit,
            showBackButton: false,
            placeholder: 'Search Anime',
          }}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.greenPrimary} />
        </View>
      ) : null}
      {error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.message}>Something went wrong</Text>
        </View>
      ) : null}

      {animeResponse ? (
        <View style={{ flex: 1, height: 800 }}>
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimeScreen;
