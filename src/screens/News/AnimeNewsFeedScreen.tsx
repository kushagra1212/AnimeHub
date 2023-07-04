import React, { useEffect, useState } from 'react';
import {
  Shadow,
  Fill,
  RoundedRect,
  Canvas,
  Group,
  SkiaView,
  useDrawCallback,
  useCanvasRef,
  Circle,
  rrect,
  rect,
  vec,
  Vertices,
  useImage,
  Skia,
  ImageSVG,
  useSVG,
  Image as SkiaImage,
  Text as SkiaText,
  useFont,
  Glyphs,
  SkFont,
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
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  GestureResponderEvent,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RNPickerSelect from 'react-native-picker-select';
import RenderHTML from 'react-native-render-html';
import { AnimeNewsData, AnimeNewsVariables, Media } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { COLORS, SIZES } from '../../theme';
import {
  genreOptions,
  sortOptions,
  statusOptions,
  typeOptions,
} from '../../utils';

import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  let svg = useSVG(require('../../../assets/filter.svg'));
  if (!svg) return null;
  const canvasWidth = 100;
  const canvasHeight = 100;
  const svgWidth = 80;
  const svgHeight = 80;
  const roundedRectWidth = 70;
  const roundedRectHeight = 70;
  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
        position: 'absolute',
        top: 50,
        right: 0,
        padding: 0,
        borderRadius: 30,
      }}
    >
      <RoundedRect
        width={roundedRectWidth}
        height={roundedRectHeight}
        r={50}
        x={canvasWidth / 2 - roundedRectWidth / 2}
        y={canvasHeight / 2 - roundedRectHeight / 2}
        color="#2F353A"
      >
        <Shadow dx={-3} dy={-3} blur={3} color="#2F353A" inner />
        <Shadow dx={-4} dy={-4} blur={10} color="#666666" />
        <Shadow dx={5} dy={5} blur={5} color="#222222" />
        <Shadow dx={3} dy={3} blur={2} color="#1C1F22" inner />
      </RoundedRect>
      {svg && (
        <ImageSVG
          svg={svg}
          height={svgWidth}
          width={svgHeight}
          x={canvasWidth / 2 - 15}
          y={canvasHeight / 2 - 15}
        />
      )}
    </Canvas>
  );
};

interface AnimeNewsFeedScreenProps {
  navigation: NativeStackNavigationProp<NewsStackParamList>;
}

const StickButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress = (event: GestureResponderEvent) => null,
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const roundedRectWidth = canvasWidth - 20;
  const roundedRectHeight = canvasHeight - 20;

  return (
    <TouchableOpacity
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transform: [
          {
            translateX: -canvasWidth / 2 + dx,
          },
          {
            translateY: -canvasHeight / 2 + dy,
          },
        ],
        position: 'absolute',

        backgroundColor: 'transparent',
      }}
      onPress={onPress}
    >
      <Canvas
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'absolute',
          marginRight: 10,
          backgroundColor: 'transparent',
        }}
      >
        <RoundedRect
          width={roundedRectWidth}
          height={roundedRectHeight}
          r={32}
          x={canvasWidth / 2 - roundedRectWidth / 2}
          y={canvasHeight / 2 - roundedRectHeight / 2}
          color="#222222"
        >
          <Shadow dx={2} dy={2} blur={1} color="#000000" inner />
          <Shadow dx={5} dy={5} blur={5} color="#444444" inner />
          <Shadow dx={-5} dy={-5} blur={10} color="#777777" />
          <Shadow dx={-4} dy={-4} blur={5} color="#000000" inner />
        </RoundedRect>
      </Canvas>
      <Text
        style={{
          color: textColor,
          marginTop: canvasHeight / 2 - 12,
          alignSelf: 'center',
          fontFamily: textFontFamily,
          justifyContent: 'center',
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const SeatedButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress,
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress: (event: GestureResponderEvent) => void;
}) => {
  const roundedRectWidth = canvasWidth - 20;
  const roundedRectHeight = canvasHeight - 20;

  return (
    <TouchableOpacity
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transform: [
          {
            translateX: -canvasWidth / 2 + dx,
          },
          {
            translateY: -canvasHeight / 2 + dy,
          },
        ],
        position: 'absolute',
      }}
      onPress={onPress}
    >
      <Canvas
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'absolute',
          marginRight: 10,
        }}
      >
        <RoundedRect
          width={roundedRectWidth}
          height={roundedRectHeight}
          r={32}
          x={canvasWidth / 2 - roundedRectWidth / 2}
          y={canvasHeight / 2 - roundedRectHeight / 2}
          color="#9F33FC"
        >
          <Shadow dx={3} dy={1} blur={0} color="#8E2DE2" inner />
          <Shadow dx={-3} dy={1} blur={0} color="#5602C8" inner />
        </RoundedRect>
      </Canvas>
      <Text
        style={{
          color: textColor,
          marginTop: canvasHeight / 2 - 12,
          alignSelf: 'center',
          fontFamily: textFontFamily,
          justifyContent: 'center',
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
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
  const fontSize = 20;

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
  const colors = ['#424750', '#424750', '#202326', '#202326'];
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

    const canvasWidth = width;
    const canvasHeight = 400;
    const roundedRectWidth = canvasWidth - 30;
    const roundedRectHeight = canvasHeight - 30;
    const source = item.source === 'ORIGINAL' ? 'Verified' : 'Manga';
    return (
      <TouchableOpacity
        style={{
          width: canvasWidth,
          height: canvasHeight,
          marginVertical: 30,
        }}
        onPress={() => handleNewsItemPress(item)}
      >
        <Canvas
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <RoundedRect
            width={roundedRectWidth}
            height={roundedRectHeight}
            r={50}
            x={canvasWidth / 2 - roundedRectWidth / 2}
            y={canvasHeight / 2 - roundedRectHeight / 2}
            color="#2E3237"
          >
            {/* 
              For the later use
            <Shadow dx={10} dy={10} blur={10} color="#444444" inner />
            <Shadow dx={-1} dy={-1} blur={10} color="#222222" inner /> */}
            <Shadow dx={1} dy={1} blur={1} color="#666666" inner />
            <Shadow dx={5} dy={5} blur={4} color="#000000" />
          </RoundedRect>
        </Canvas>
        <View
          style={[
            styles.card,
            {
              position: 'absolute',
              width: roundedRectWidth,
              height: roundedRectHeight,
              top: canvasWidth / 2 - roundedRectWidth / 2,
              left: 20,
              backgroundColor: 'transparent',
            },
          ]}
        >
          <Text style={styles.title}>{item.title.english}</Text>

          <RenderHTML
            contentWidth={200}
            baseStyle={{
              fontSize: 15,
              color: COLORS.GraySecondary,
              width: '100%',
              padding: 10,
              textAlign: 'justify',
            }}
            source={{ html: item.description?.slice(0, 150) }}
          />
          {description && description?.length > 150 && (
            <View
              style={{
                height: 50,
              }}
            >
              <SeatedButton
                dx={70}
                dy={20}
                canvasHeight={60}
                canvasWidth={140}
                text="Read More"
                textColor="white"
                textFontFamily="semi-bold"
                onPress={() => handleNewsItemPress(item)}
              />
            </View>
          )}

          {/* <FlatList
              data={item.genres}
              horizontal
              renderItem={({ item }) => (
                <Genre genre={item} fontRegular={fontRegular} />
              )}
              keyExtractor={(item) => item}
            /> */}

          <View
            style={{
              position: 'relative',
              marginLeft: 60,
              height: 60,
            }}
          >
            {item.genres
              ?.slice(0, Math.min(3, item.genres.length))
              .map((item, index) => (
                <StickButton
                  text={item}
                  canvasHeight={60}
                  canvasWidth={120}
                  dx={120 * index}
                  dy={30}
                  textColor="white"
                  textFontFamily="semi-bold"
                  key={index}
                />
              ))}
          </View>

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
        <RoundedNeumorphicButton />
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
      <View style={{ marginTop: 150 }}>
        <FlatList
          data={newsData}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
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
    fontSize: SIZES.h3,
    marginBottom: 5,
    color: COLORS.white,
    margin: 10,
    fontFamily: 'extra-bold',
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
