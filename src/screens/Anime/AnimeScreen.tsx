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
import { WINDOW_WIDTH, throttleFunc } from '../../utils';
import AnimeSearch from '../../components/molecules/Search';
import AnimeCard from '../../components/molecules/AnimeCard';
import { useFocusEffect } from '@react-navigation/native';
import Search from '../../components/molecules/Search';
import { FlashList } from '@shopify/flash-list';
import { GET_ANIMES_USING_SEARCH } from '../../graphql/queries/anime-queries';
import Background from '../../components/ui-components/Background';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchInput } from '../../components/ui-components/SearchInput';
import { Ionicons } from '@expo/vector-icons';
import Shadder from '../../components/ui-components/Shadder';
const AnimeScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);

  const page = 1;
  const perPage = 5;
  const [animeResponse, setAnimeResponse] = useState(null);
  const [isLoadiing, setIsLoading] = useState(false);
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
    if (
      animeResponse &&
      !isLoadiing &&
      !loading &&
      animeResponse.pageInfo.hasNextPage
    ) {
      setIsLoading(true);
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
        .catch((err) => console.log(err, 'Anime Response'))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (data && !animeResponse && !loading) {
      setAnimeResponse({
        pageInfo: data.Page.pageInfo,
        animes: data.Page.media,
      });
    }
  }, [data]);
  const Card = ({ item }) => {
    return <AnimeCard item={item} navigation={navigation} />;
  };
  const roundedRectWidth = WINDOW_WIDTH - 20,
    roundedRectHeight = 60,
    canvasWidth = WINDOW_WIDTH,
    canvasHeight = 120;
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        {/* <View
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
              placeholder: 'Search for Anime',
            }}
          />
        </View> */}

        <SearchInput
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          dx={WINDOW_WIDTH / 2}
          dy={80}
          focused={true}
          roundedRectHeight={roundedRectHeight}
          roundedRectWidth={roundedRectWidth}
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
                searchText: '',
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
                autofocus: false,
              }}
            />
            <Ionicons
              name="search"
              size={30}
              color={COLORS.GraySecondary}
              style={{
                position: 'absolute',
                top: 15,
                right: 30,
                opacity: 0.8,
              }}
            />
          </View>
        </SearchInput>

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
      </SafeAreaView>
    </Background>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
