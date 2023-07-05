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
          display: 'none',
        },
      });
    }
    return () => {
      navigation?.getParent()?.setOptions({
        tabBarStyle: undefined,
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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBackHandler}>
        <AntDesign
          name="arrowleft"
          size={30}
          color="white"
          style={{ fontWeight: '800' }}
        />
      </TouchableOpacity>
      <Image style={styles.bannerImage} source={{ uri: anime.bannerImage }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{anime.title.english}</Text>
        <Text style={styles.description}>{anime.description}</Text>
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

            <Text style={styles.infoValue}>{anime.isAdult ? 'Yes' : 'No'}</Text>
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Staff:</Text>

            <Text style={styles.infoValue}>
              {anime.staff.edges.map((edge) => edge.node.gender).join(', ')}
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

        <Reviews mediaId={mediaId} />

        {anime?.trailer && (
          <TouchableOpacity
            style={styles.trailerContainer}
            onPress={() => handleTrailerPress(anime.trailer.site)}
          >
            <AntDesign
              name="playcircleo"
              size={64}
              color="rgba(255, 255, 255, 0.9)"
              style={styles.playIcon}
            />
            <Image
              style={styles.trailerThumbnail}
              source={{ uri: anime?.trailer?.thumbnail }}
            />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 15,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
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
});

export default AnimeDetailsScreen;
