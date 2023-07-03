import React, { useState } from 'react';
import {
  Shadow,
  Fill,
  RoundedRect,
  Canvas,
  Group,
  SkiaView,
  Skia,
  useDrawCallback,
  useCanvasRef,
  Circle,
  Text as SkiaText,
  rrect,
  rect,
  vec,
  Vertices,
} from '@shopify/react-native-skia';
import {
  View,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  Modal,
  Text,
  Dimensions,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import RenderHTML from 'react-native-render-html';
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS } from '../../theme';
import {
  genreOptions,
  sortOptions,
  statusOptions,
  typeOptions,
} from '../../utils';

import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
const GET_ANIME_NEWS = gql`
  query GetAnimeNews(
    $genre: String
    $page: Int
    $perPage: Int
    $type: MediaType
    $status: MediaStatus
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
      }
      media(genre: $genre, type: $type, status: $status, sort: $sort) {
        id
        title {
          english
        }
        coverImage {
          extraLarge
        }
        description
        genres
        source
        episodes
        startDate {
          year
        }
        endDate {
          year
        }
      }
    }
  }
`;

const { width, height } = Dimensions.get('window');
const paint = Skia.Paint();
paint.setAntiAlias(true);

export const ImperativeAPI = ({ children }) => {
  const center = vec(width / 2, height / 2);
  const rRect = rrect(rect(center.x - 150, center.y - 90, 300, 180), 12, 12);

  return <SkiaView style={{ flex: 1 }}>{children}</SkiaView>;
};

const Neumorphism = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <RoundedRect
        x={32}
        y={32}
        width={192}
        height={192}
        r={32}
        color="lightblue"
      >
        <Shadow dx={12} dy={12} blur={25} color="#93b8c4" />
        <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" />
      </RoundedRect>
    </Canvas>
  );
};
const RoundedNeumorphicButton = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <RoundedRect
        x={32}
        y={32}
        width={192}
        height={192}
        r={50}
        color="#2F353A"
      >
        <Shadow dx={2} dy={2} blur={2} color="#2F353A" inner />
        <Shadow dx={-2} dy={-2} blur={50} color="#7777" inner />
        <Shadow dx={-12} dy={-12} blur={20} color="#9999" />
        <Shadow dx={2} dy={2} blur={2} color="#0000" />
      </RoundedRect>
    </Canvas>
  );
};

interface AnimeNewsFeedScreenProps {
  navigation: NativeStackNavigationProp<NewsStackParamList>;
}

const AnimeNewsFeedScreen: React.FC<AnimeNewsFeedScreenProps> = ({
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] =
    useState<AnimeNewsVariables['type']>('undefined');
  const [selectedSort, setSelectedSort] =
    useState<AnimeNewsVariables['sort']>('undefined');
  const [selectedStatus, setSelectedStatus] =
    useState<AnimeNewsVariables['status']>('undefined');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const ref = useCanvasRef();
  const { loading, error, data, fetchMore } = useQuery<
    AnimeNewsData,
    AnimeNewsVariables
  >(GET_ANIME_NEWS, {
    variables: {
      genre: selectedGenre === 'All' ? undefined : selectedGenre,
      page,
      perPage,
      sort: selectedSort === 'undefined' ? undefined : selectedSort,
      type: selectedType === 'undefined' ? undefined : selectedType,
      status: selectedStatus === 'undefined' ? undefined : selectedStatus,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text> Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const _data =
    data?.Page.media.filter((item) => item.title.english !== null) ?? [];
  const newsData = Array.from(
    new Map(_data.map((item) => [item.id, item])).values()
  );
  const pageInfo = data?.Page.pageInfo;

  const handleNewsItemPress = (item: Media) => {
    navigation.navigate('DetailedNewsScreen', { mediaId: item.id });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleTypeChange = (type: AnimeNewsVariables['type']) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleSortChange = (sort: AnimeNewsVariables['sort']) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const handleStatusChange = (status: AnimeNewsVariables['status']) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const vertices = [
    vec(0, 0),
    vec(width, 0),
    vec(width, height),
    vec(0, height),
  ];
  const colors = ['#353A40', '#353A40', '#16171B', '#16171B'];
  const indices = [0, 1, 2, 0, 3, 2];
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
  const renderNewsItem = ({ item }: { item: Media }) => {
    let description = item.description || '';

    if (description && description?.length > 150) {
      description = `${description?.slice(0, 150)}...`;
    }

    return (
      <TouchableOpacity onPress={() => handleNewsItemPress(item)}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title.english}</Text>
          <RenderHTML
            contentWidth={200}
            source={{ html: item.description?.slice(0, 150) }}
          />
          {/* Render HTML content */}
          {description && description?.length > 150 && (
            <TouchableOpacity onPress={() => handleNewsItemPress(item)}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          )}

          {item?.genres && (
            <Text style={styles.genres}>Genres: {item.genres.join(', ')}</Text>
          )}
          {item?.source && (
            <Text style={styles.source}>Source: {item.source}</Text>
          )}
          {item.episodes && (
            <Text style={styles.episodes}>Episodes: {item.episodes}</Text>
          )}
          {item.startDate?.year && (
            <Text style={styles.startDate}>
              Start Date: {item.startDate.year}
            </Text>
          )}
          {item.endDate?.year && (
            <Text style={styles.endDate}>End Date: {item.endDate.year}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{
          flex: 1,
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      >
        <Vertices vertices={vertices} colors={colors} indices={indices} />
      </Canvas>
      <RoundedNeumorphicButton />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View></View>
      </Modal>
      <TouchableOpacity onPress={() => {}}>
        <FontAwesome name="filter" size={50} color="white" />
      </TouchableOpacity>

      {/* <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Genre:</Text>
        <RNPickerSelect
          onValueChange={handleGenreChange}
          items={genreOptions}
          value={selectedGenre}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Genre', value: 'All' }}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Type:</Text>
        <RNPickerSelect
          onValueChange={handleTypeChange}
          items={typeOptions}
          value={selectedType}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Type', value: 'undefined' }}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort By:</Text>
        <RNPickerSelect
          onValueChange={handleSortChange}
          items={sortOptions}
          value={selectedSort}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Sort', value: 'undefined' }}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Status:</Text>
        <RNPickerSelect
          onValueChange={handleStatusChange}
          items={statusOptions}
          value={selectedStatus}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Status', value: 'undefined' }}
        />
      </View> */}

      {/* <FlatList
        data={newsData}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      /> */}
    </View>
  );
};

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    color: COLORS.primary,
    paddingRight: 30,
    backgroundColor: COLORS.lightGrayPrimary,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    color: COLORS.primary,
    paddingRight: 30,
    backgroundColor: COLORS.lightGrayPrimary,
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
  chevronIcon: {
    color: COLORS.primary,
    fontSize: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.lightGrayPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  readMore: {
    color: COLORS.primary,
    marginTop: 5,
  },
  genres: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  source: {
    marginBottom: 5,
  },
  episodes: {
    marginBottom: 5,
  },
  startDate: {
    marginBottom: 5,
  },
  endDate: {
    marginBottom: 5,
  },
  trailerThumbnail: {
    width: 200,
    height: 100,
    resizeMode: 'cover',
  },
});

export default AnimeNewsFeedScreen;
