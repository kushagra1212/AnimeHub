import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimeStackParamList } from '../../Navigation';
import Reviews from '../../components/organs/Reviews';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { GET_ANIME_DETAILS } from '../../graphql/queries/anime-queries';
import Background from '../../components/ui-components/Background';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { ImageCardNeon } from '../../components/ui-components/ImageCard';
import { WINDOW_HEIGHT, WINDOW_WIDTH, tabBarStyle } from '../../utils';
import RenderHTML from 'react-native-render-html';
import { htmlStyles } from '../News/DetailedNewsScreen';
import Trailer from '../../components/molecules/Trailer';
type AnimeDetailsScreenProps = {
  route: {
    params: {
      mediaId: string;
    };
  };
  navigation: NativeStackNavigationProp<AnimeStackParamList>;
};

const AnimeDetailsScreen: React.FC<AnimeDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { mediaId } = route.params;
  const { loading, error, data } = useQuery(GET_ANIME_DETAILS, {
    variables: {
      mediaId: mediaId,
    },
  });
  useEffect(() => {
    if (navigation && data?.Media) {
      navigation?.getParent()?.setOptions({
        tabBarStyle: {
          ...tabBarStyle,
          display: 'none',
        },
      });
    }
    return () => {
      navigation?.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
      });
    };
  }, [navigation, data?.Media]);
  const goBackHandler = () => {
    navigation.goBack();
  };

  const handleTrailerPress = (site) => {
    // Handle trailer press action here
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#888888" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  const anime = data?.Media;

  return (
    <Background>
      <View style={styles.container}>
        <InwardButtonElevated
          canvasHeight={100}
          canvasWidth={100}
          dx={40}
          dy={60}
          focused={true}
          roundedRectHeight={50}
          roundedRectWidth={50}
          onPress={goBackHandler}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            color={COLORS.white}
            size={30}
            style={{
              marginTop: 50 - 15,
              marginLeft: 50 - 15,
            }}
          />
        </InwardButtonElevated>
        <ImageCardNeon
          canvasHeight={500}
          canvasWidth={WINDOW_WIDTH}
          dx={WINDOW_WIDTH / 2}
          dy={200}
          focused={true}
          roundedRectHeight={200}
          roundedRectWidth={WINDOW_WIDTH}
          onPress={goBackHandler}
        >
          <Image
            source={{ uri: anime.bannerImage }}
            style={[
              styles.coverImage,
              {
                opacity: 0.9,
                width: WINDOW_WIDTH,
                height: 200,
                marginTop: 500 / 2 - 200 / 2,
              },
            ]}
          />
        </ImageCardNeon>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{anime.title.english}</Text>
        </View>
        <ScrollView style={styles.content}>
          {anime?.description ? (
            <View>
              <Text style={styles.subtitle}>Description</Text>

              <RenderHTML
                contentWidth={300 - 40}
                source={{ html: anime.description }}
                tagsStyles={htmlStyles}
                baseStyle={styles.description}
              />
            </View>
          ) : null}

          <Reviews mediaId={mediaId} />

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Average Score:</Text>
              <Text style={styles.infoValue}>{anime.averageScore}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Popularity:</Text>
              <Text style={styles.infoValue}>{anime.popularity}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{anime.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Format:</Text>
              <Text style={styles.infoValue}>{anime.format}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Season:</Text>

              <Text style={styles.infoValue}>Season: {anime.season}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mean Score:</Text>

              <Text style={styles.infoValue}>{anime.meanScore}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hashtag:</Text>

              <Text style={styles.infoValue}>{anime.hashtag || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Is Adult:</Text>

              <Text style={styles.infoValue}>
                {anime.isAdult ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trending:</Text>

              <Text style={styles.infoValue}>
                {anime.trending ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>

              <Text style={styles.infoValue}>{anime.duration} min</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Genres:</Text>

              <Text style={styles.infoValue}>{anime.genres.join(', ')}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Studios:</Text>

              <Text style={styles.infoValue}>
                {anime.studios.nodes.map((studio) => studio.name).join(', ')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Characters:</Text>

              <Text style={styles.infoValue}>
                {anime.characters.nodes
                  .map((character) => character.name.full)
                  .join(', ')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start Date:</Text>
              <Text style={styles.infoValue}>
                {anime.startDate.year}-{anime.startDate.month}-
                {anime.startDate.day}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>End Date:</Text>
              <Text style={styles.infoValue}>
                {anime.endDate.year}-{anime.endDate.month}-{anime.endDate.day}
              </Text>
            </View>
          </View>

          {anime?.trailer ? <Trailer trailerId={anime.trailer.id} /> : null}
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 20,
    marginTop: 300,
  },
  title: {
    fontSize: 24,
    fontFamily: 'extra-bold',
    marginBottom: 10,
    color: COLORS.white,
  },
  description: {
    fontSize: 16,
    marginBottom: 1,
    color: COLORS.white,
    fontFamily: 'medium',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    width: 120,
    fontFamily: 'medium',
    color: COLORS.white,
  },
  infoValue: {
    flex: 1,
    fontFamily: 'medium',
    color: COLORS.white,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  trailerContainer: {
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerThumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  coverImage: {
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'semi-bold',
    marginTop: 20,
    color: COLORS.white,
    marginBottom: 10,
  },
  content: {
    height: WINDOW_HEIGHT - 400,
    overflow: 'scroll',
    width: WINDOW_WIDTH - 30,
  },
});

export default AnimeDetailsScreen;
