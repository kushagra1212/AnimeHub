import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLazyQuery, gql, useQuery } from '@apollo/client';
import { COLORS } from '../../theme';

const GET_ANIME_LIST = gql`
  query Page($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media {
        bannerImage
        averageScore
        coverImage {
          extraLarge
        }
        episodes
        duration
        endDate {
          year
        }
        isAdult
        popularity
        rankings {
          season
        }
        title {
          english
        }
        id
      }
    }
  }
`;

const SearchBar = ({ handleSearchBarPress }) => {
  const handleSearch = () => {};
  return (
    <View style={styles.searchContainer}>
      <View
        onTouchStart={handleSearchBarPress}
        style={{
          backgroundColor: COLORS.primary,
          zIndex: 100,
          height: '100%',
          width: '100%',
          opacity: 0,
          position: 'absolute',
        }}
      ></View>
      <TextInput
        style={styles.input}
        placeholder="Search Anime"
        value={''}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const Card = ({ anime, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(anime)}
    >
      {/* <Image
        source={{ uri: anime?.coverImage?.extraLarge }}
        style={styles.cardImage}
      /> */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {anime?.title?.english}({anime?.episodes})
        </Text>
        <Text style={styles.cardDescription}>{anime?.averageScore}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AnimeScreen = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const perPage = 1;

  const { loading, error, data, fetchMore } = useQuery(GET_ANIME_LIST);

  useEffect(() => {
    fetchMore({
      variables: {
        page,
        perPage,
      },
    });
  }, [page]);
  const animeList = data?.Page.media ?? [];

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleSearchBarPress = () => {
    navigation.navigate('AnimeSearchScreen');
  };

  const handleCardPress = (anime) => {
    navigation.navigate('AnimeDetailsScreen', { animeId: anime.id });
  };

  const renderAnimeCard = ({ item }) => (
    <Card anime={item} onPress={handleCardPress} />
  );
  return (
    <View style={styles.container}>
      <SearchBar handleSearchBarPress={handleSearchBarPress} />
      <FlatList
        data={animeList}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={renderAnimeCard}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
      {loading && <ActivityIndicator size="large" color="blue" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GrayPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: COLORS.GrayPrimary,
  },
});

export default AnimeScreen;
