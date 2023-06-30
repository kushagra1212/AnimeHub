import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
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
const AnimeSearchScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const page = 1;
  const perPage = 10;
  const { loading, data, fetchMore, error } = useQuery(GET_MEDIA_SEARCH, {
    variables: {
      search: searchText.trim().toLowerCase(),
      type: 'ANIME',
      page: page,
      perPage: perPage,
    },
  });
  const pageInfo = data?.Page.pageInfo;

  const animeData = data?.Page.media ?? [];
  const goBackHandler = () => {
    navigation.goBack();
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
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

  const renderAnimeCard = ({ item }) => {
    return (
      <View style={{ backgroundColor: COLORS.redPrimary, height: 100 }}>
        {/* <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: item.coverImage.extraLarge }}
        /> */}
        <Text style={{ color: COLORS.black }}>{item.title.english}</Text>
      </View>
    );
  };
  const handleLoadMore = () => {
    console.log('load more', pageInfo?.hasNextPage);
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

  console.log('Loading', loading);
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bluePrimary }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AntDesign
          onPress={goBackHandler}
          name="arrowleft"
          size={24}
          color="black"
        />

        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.input}
            placeholder="Search Anime"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
        {animeData.length === 0 && searchText && searchText !== '' && (
          <Text>No results found</Text>
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
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: COLORS.GrayPrimary,
    borderRadius: 8,
  },
  button: {
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
export default AnimeSearchScreen;
