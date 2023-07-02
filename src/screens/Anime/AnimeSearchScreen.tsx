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
import AnimeSearch from '../../components/molecules/AnimeSearch';
import AnimeCard from '../../components/molecules/RenderAnimeCard';

const GET_MEDIA_SEARCH = gql`
  query SearchAnime(
    $search: String
    $type: MediaType
    $page: Int
    $perPage: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: $type) {
        id
        title {
          english
        }
        bannerImage
        genres
        tags {
          name
        }
        rankings {
          type
          format
          allTime
          id
        }
        coverImage {
          extraLarge
        }
      }
      pageInfo {
        hasNextPage
        currentPage
      }
    }
  }
`;

const AnimeSearchScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const [prevDate, setPrevDate] = useState(Date.now());
  const [queryText, setQueryText] = useState('');
  const page = 1;
  const perPage = 10;
  const { loading, data, fetchMore, error } = useQuery(GET_MEDIA_SEARCH, {
    variables: {
      search: queryText.trim().toLowerCase(),
      type: 'ANIME',
      page: page,
      perPage: perPage,
    },
  });
  const pageInfo = data?.Page.pageInfo;

  const animeData = useMemo(() => {
    let media = data?.Page.media ?? [];

    media = Array.from(new Map(media.map((item) => [item.id, item])).values());
    return media.filter(
      (item) => item.title.english !== null && !item.genres.includes('Hentai')
    );
  }, [data]);
  const goBackHandler = () => {
    navigation.replace('AnimeScreen');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    console.log(Date.now() - prevDate);
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
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: { page: pageInfo.currentPage + 1 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            Page: {
              media: [
                ...(prev.Page.media ?? []),
                ...(fetchMoreResult?.Page.media ?? []),
              ],
              pageInfo: fetchMoreResult.Page.pageInfo,
            },
          };
        },
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
      <AnimeSearch
        ref={searchInputRef}
        {...{
          goBackHandler,
          searchText,
          handleSearch,
          handleSearchSubmit,
          showBackButton: true,
        }}
      />
      {animeData.length === 0 &&
        searchText &&
        searchText !== '' &&
        !loading && <Text style={styles.message}>No results found</Text>}
      {animeData.length === 0 && searchText === '' && !loading && (
        <Text style={styles.message}>Search Anime Here</Text>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.greenPrimary} />
        </View>
      ) : (
        <FlatList
          data={animeData}
          renderItem={Card}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={2}
        />
      )}
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

export default AnimeSearchScreen;
