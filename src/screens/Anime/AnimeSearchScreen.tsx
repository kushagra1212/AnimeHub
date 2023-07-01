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
        lastPage
      }
    }
  }
`;
const renderAnimeCard = ({ item }) => {
  const { coverImage, title, genres, tags, rankings } = item;

  return (
    <View style={animeCardStyles.animeCard}>
      <Image
        style={animeCardStyles.coverImage}
        source={{ uri: coverImage.extraLarge }}
      />
      <View style={animeCardStyles.infoContainer}>
        <Text style={animeCardStyles.title}>{title.english}</Text>
        {genres.length > 0 && (
          <Text style={animeCardStyles.genres}>
            Genres: {genres.join(', ')}
          </Text>
        )}

        {rankings.length > 0 ? (
          <View>
            <Text style={animeCardStyles.rankingsTitle}>Rankings:</Text>
            <FlatList
              data={rankings}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Text style={animeCardStyles.ranking}>
                  {item.type} - {item.format}
                </Text>
              )}
              contentContainerStyle={animeCardStyles.rankingsContainer}
            />
          </View>
        ) : null}
      </View>
      {tags.length > 0 && (
        <View style={animeCardStyles.tagsContainer}>
          <Text style={animeCardStyles.tagsTitle}>Tags:</Text>
          <FlatList
            data={tags}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Text style={animeCardStyles.tag}>{item.name}</Text>
            )}
            contentContainerStyle={animeCardStyles.tagsFlatList}
          />
        </View>
      )}
    </View>
  );
};

const animeCardStyles = StyleSheet.create({
  animeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  genres: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666666',
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333333',
  },
  ranking: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666666',
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
  },
  rankingsContainer: {
    paddingTop: 8,
  },
  tagsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: 16,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  tagsFlatList: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  tag: {
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
});

const AnimeSearch = forwardRef(
  (props: any, ref: React.LegacyRef<TextInput>) => {
    const { goBackHandler, searchText, handleSearch, handleSearchSubmit } =
      props;
    return (
      <View style={specificStyles.container}>
        <AntDesign
          onPress={goBackHandler}
          name="arrowleft"
          size={24}
          color="black"
          style={specificStyles.icon}
        />

        <View style={specificStyles.inputContainer}>
          <TextInput
            ref={ref}
            style={specificStyles.input}
            placeholder="Search Anime"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
      </View>
    );
  }
);

const specificStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
});

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

    return media.filter(
      (item) =>
        item.title.english !== null &&
        !item.genres.includes('Hentai') &&
        item.tags.find((tag) => tag.name.toLower() === 'nudity') === -1
    );
  }, [data]);
  const goBackHandler = () => {
    navigation.goBack();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AnimeSearch
        ref={searchInputRef}
        {...{ ...goBackHandler, searchText, handleSearch, handleSearchSubmit }}
      />
      {animeData.length === 0 &&
        searchText &&
        searchText !== '' &&
        !loading && <Text>No results found</Text>}
      {animeData.length === 0 && searchText === '' && !loading && (
        <Text>Search Anime Here</Text>
      )}
      {loading ? (
        <View>
          <ActivityIndicator size="large" color={COLORS.greenPrimary} />
        </View>
      ) : (
        <FlatList
          data={animeData}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={2}
        />
      )}
    </View>
  );
};

export default AnimeSearchScreen;
