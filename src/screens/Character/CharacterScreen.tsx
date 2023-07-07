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
import { throttleFunc, typeOptionsCharacter } from '../../utils';
import AnimeSearch from '../../components/molecules/Search';
import AnimeCard from '../../components/molecules/AnimeCard';
import { useFocusEffect } from '@react-navigation/native';
import Search from '../../components/molecules/Search';
import CharacterCard from '../../components/molecules/CharacterCard';

import { pickerSelectStyles } from '../News/AnimeNewsFeedScreen';
import { FlashList } from '@shopify/flash-list';
import { GET_CHARACTER_USING_SEARCH } from '../../graphql/queries/character-queries';

interface SemiCharacter {
  id: number;
  name?: {
    full: string;
  };
  image?: {
    large: string;
  };
  age?: number;
  favourites?: number;
  gender?: string;
}
interface PageInfo {
  hasNextPage: boolean;
  currentPage: number;
}
interface CharacterResponse {
  pageInfo: PageInfo;
  characters: SemiCharacter[];
}

const CharacterScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [prevDate, setPrevDate] = useState(Date.now());
  const [queryText, setQueryText] = useState(null);
  const [sort, setSort] = useState('undefined');
  const [characterResponse, setCharacterResponse] =
    useState<CharacterResponse | null>(null);
  const perPage = 10;
  const { loading, data, fetchMore, error } = useQuery(
    GET_CHARACTER_USING_SEARCH,
    {
      variables: {
        page: 1,
        perPage: perPage,
        sort: sort === 'undefined' ? null : [sort],
        search: queryText ? queryText?.trim().toLowerCase() : null,
      },
    }
  );

  useEffect(() => {
    if (data && !characterResponse) {
      setCharacterResponse({
        characters: data.Page.characters,
        pageInfo: data.Page.pageInfo,
      });
    }
  }, [data]);

  const goBackHandler = () => {};

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (Date.now() - prevDate > 300) {
      setCharacterResponse(null);
      if (text === '') setQueryText(null);
      else setQueryText(text);
      setPrevDate(Date.now());
    }
  };
  const handleSearchSubmit = () => {
    handleSearch(searchText);
  };
  const handleLoadMore = () => {
    if (characterResponse && characterResponse?.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          page: characterResponse.pageInfo.currentPage + 1,
        },
      })
        .then((res) => {
          setCharacterResponse({
            characters: [
              ...characterResponse.characters,
              ...res.data.Page.characters,
            ],
            pageInfo: res.data.Page.pageInfo,
          });
        })
        .catch((err) => {
          console.log(err, 'CharacterScreen N Error');
        });
    }
  };
  const handleTypeChange = (type) => {
    setSort(type);
    setCharacterResponse(null);
  };

  const Card = ({ item }) => {
    return <CharacterCard {...{ item, navigation }} />;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'relative',
          backgroundColor: COLORS.black,
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
            placeholder: 'Search Anime Characters',
          }}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.greenPrimary} />
        </View>
      ) : null}
      {!loading && !characterResponse ? (
        <View>
          <Text>No results found</Text>
        </View>
      ) : null}
      {/* <RNPickerSelect
        onValueChange={handleTypeChange}
        items={typeOptionsCharacter}
        value={sort}
        style={pickerSelectStyles}
        placeholder={{
          label: 'Select a type...',
          value: 'undefined',
        }}
      /> */}

      {characterResponse ? (
        <View
          style={{
            flex: 1,
            height: 1000,
          }}
        >
          <FlashList
            estimatedItemSize={2000}
            data={characterResponse?.characters}
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

export default CharacterScreen;
