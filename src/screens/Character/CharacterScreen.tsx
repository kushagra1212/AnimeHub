import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../theme';
import { useQuery } from '@apollo/client';
import { WINDOW_WIDTH } from '../../utils';
import Search from '../../components/molecules/Search';
import CharacterCard from '../../components/molecules/CharacterCard';

import { FlashList } from '@shopify/flash-list';
import { GET_CHARACTER_USING_SEARCH } from '../../graphql/queries/character-queries';
import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../../components/ui-components/Background';
import { SearchInput } from '../../components/ui-components/SearchInput';
import { Ionicons } from '@expo/vector-icons';
import Shadder from '../../components/ui-components/Shadder';
import { showMessage } from 'react-native-flash-message';
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
  const searchInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState('');
  const [prevDate, setPrevDate] = useState(Date.now());
  const [queryText, setQueryText] = useState(null);
  const [sort, setSort] = useState(undefined);
  const [characterResponse, setCharacterResponse] =
    useState<CharacterResponse | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const perPage = 5;
  const { loading, data, fetchMore, error, refetch } = useQuery(
    GET_CHARACTER_USING_SEARCH,
    {
      variables: {
        page: 1,
        perPage: perPage,
        sort: sort ? [sort] : sort,
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
  }, [data, characterResponse]);

  const goBackHandler = () => {};

  const handleSearch = (text: string) => {
    setSearchText(text);

    setCharacterResponse(null);
    if (text === '') {
      setQueryText(undefined);
    } else if (Date.now() - prevDate > 300) {
      setQueryText(text);
      setPrevDate(Date.now());
    }
  };

  const handleSearchSubmit = () => {
    // handleSearch(searchText);
  };
  const handleLoadMore = () => {
    if (
      !isLoading &&
      characterResponse &&
      characterResponse.pageInfo.hasNextPage
    ) {
      setIsloading(true);
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
          showMessage({
            message: 'Error !',
            description: 'Something Went Wrong, try again later',
            type: 'danger',
            color: 'white',
            backgroundColor: COLORS.redPrimary,
          });
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };
  useEffect(() => {
    if (error) {
      showMessage({
        message: 'Error !',
        description: 'Something Went Wrong, try again later',
        type: 'danger',
        color: 'white',
        backgroundColor: COLORS.redPrimary,
      });
    }
  }, [error]);

  const Card = ({ item }) => {
    return <CharacterCard {...{ item, navigation }} />;
  };
  const roundedRectWidth = WINDOW_WIDTH - 20,
    roundedRectHeight = 60,
    canvasWidth = WINDOW_WIDTH,
    canvasHeight = 120;
  return (
    <Background>
      <SafeAreaView style={styles.container}>
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
                placeholder: 'Search for anime characters',
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
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0DD9FA" />
          </View>
        ) : null}
        {!loading &&
        characterResponse &&
        characterResponse.characters.length === 0 &&
        searchText !== '' ? (
          <View style={styles.loadingContainer}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'extra-bold',
                fontSize: 25,
                alignSelf: 'center',
              }}
            >
              No results found
            </Text>
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

        {characterResponse && characterResponse.characters.length ? (
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
              data={characterResponse?.characters}
              renderItem={Card}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
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
    height: 800,
    marginTop: 100,
    marginBottom: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default CharacterScreen;
