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

import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles } from '../News/AnimeNewsFeedScreen';
import { FlashList } from '@shopify/flash-list';

const GET_CHARACTER_SEARCH = gql`
  query Query(
    $page: Int
    $perPage: Int
    $sort: [CharacterSort]
    $search: String
  ) {
    Page(page: $page, perPage: $perPage) {
      characters(sort: $sort, search: $search) {
        age
        bloodType
        favourites
        gender
        id
        image {
          large
        }
        name {
          full
        }
      }
      pageInfo {
        currentPage
        hasNextPage
        lastPage
      }
    }
  }
`;

const CharacterScreen = ({ navigation }) => {
  const searchInputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [prevDate, setPrevDate] = useState(Date.now());
  const [queryText, setQueryText] = useState(null);
  const [sort, setSort] = useState('undefined');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { loading, data, fetchMore, error } = useQuery(GET_CHARACTER_SEARCH, {
    variables: {
      page: page,
      perPage: perPage,
      sort: sort === 'undefined' ? null : [sort],
      search: queryText?.trim().toLowerCase() || queryText,
    },
  });
  const pageInfo = data?.Page.pageInfo;

  let characterData = data?.Page.characters ?? [];
  characterData = Array.from(
    new Map(characterData.map((item) => [item.id, item])).values()
  );

  const goBackHandler = () => {};

  const handleSearch = (text: string) => {
    setSearchText(text);
    console.log(Date.now() - prevDate);
    if (Date.now() - prevDate > 300) {
      if (text === '') setQueryText(null);
      else setQueryText(text);
      setPrevDate(Date.now());
    }
  };
  const handleSearchSubmit = () => {
    handleSearch(searchText);
  };
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
              characters: [
                ...(prev.Page.characters ?? []),
                ...(fetchMoreResult?.Page.characters ?? []),
              ],
              pageInfo: fetchMoreResult.Page.pageInfo,
            },
          };
        },
      });
    }
  };

  console.log(pageInfo, 'CharacterScreen');
  const handleTypeChange = (type) => {
    setSort(type);
    setPage(1);
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.greenPrimary} />
        </View>
      )}
      <RNPickerSelect
        onValueChange={handleTypeChange}
        items={typeOptionsCharacter}
        value={sort}
        style={pickerSelectStyles}
        placeholder={{
          label: 'Select a type...',
          value: 'undefined',
        }}
      />

      <View
        style={{
          flex: 1,
          height: 1000,
        }}
      >
        <FlashList
          estimatedItemSize={2000}
          data={characterData}
          renderItem={Card}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={2}
        />
      </View>
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
