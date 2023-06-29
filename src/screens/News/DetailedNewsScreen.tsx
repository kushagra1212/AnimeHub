import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RenderHTML from 'react-native-render-html';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NewsStackParamList } from '../../Navigation';
import { Media } from '../../types';

type DetailedNewsScreenProps = {
  route: {
    params: {
      mediaId: string;
    };
  };
  navigation: NativeStackNavigationProp<NewsStackParamList>;
};

const GET_MEDIA_DETAILS = gql`
  query GetMediaDetails($mediaId: Int) {
    Media(id: $mediaId) {
      id
      title {
        english
      }
      coverImage {
        medium
      }
      description
      genres
      source
      episodes
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      staff {
        edges {
          node {
            id
            name {
              full
            }
          }
        }
      }
      studios {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const DetailedNewsScreen: React.FC<DetailedNewsScreenProps> = ({
  route,
  navigation,
}) => {
  const { mediaId } = route.params;
  const { loading, error, data } = useQuery(GET_MEDIA_DETAILS, {
    variables: {
      mediaId: parseInt(mediaId),
    },
  });

  useEffect(() => {
    if (navigation && data?.Media) {
      navigation.setOptions({
        title: data.Media.title.english,
      });
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
  }, [navigation, data?.Media]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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

  const media: Media = data.Media;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: media.coverImage.medium }}
        style={styles.coverImage}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{data.Media.title.english}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Genres:</Text>
            <Text style={styles.detailsText}>{media.genres.join(', ')}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Source:</Text>
            <Text style={styles.detailsText}>{media.source}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Episodes:</Text>
            <Text style={styles.detailsText}>{media.episodes}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Start Date:</Text>
            <Text style={styles.detailsText}>
              {`${media.startDate.year}-${media.startDate.month}-${media.startDate.day}`}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>End Date:</Text>
            <Text style={styles.detailsText}>
              {`${media.endDate.year}-${media.endDate.month}-${media.endDate.day}`}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Staff:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.staffContainer}
            >
              {media.staff.edges.map(({ node }, index) => (
                <Text key={index} style={styles.staffText}>
                  {node.name.full}
                </Text>
              ))}
            </ScrollView>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Studios:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.studiosContainer}
            >
              {media.studios.edges.map(({ node }) => (
                <Text key={node.id} style={styles.studiosText}>
                  {node.name}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
        <Text style={styles.subtitle}>Description</Text>
        <RenderHTML
          contentWidth={300}
          source={{ html: media.description }}
          tagsStyles={htmlStyles}
        />
        {media.trailer && (
          <View style={styles.trailerContainer}>
            <Text style={styles.subtitle}>Trailer</Text>
            <View style={styles.trailerDetails}>
              <Text style={styles.trailerLabel}>ID:</Text>
              <Text style={styles.trailerText}>{media.trailer.id}</Text>
            </View>
            <View style={styles.trailerDetails}>
              <Text style={styles.trailerLabel}>Site:</Text>
              <Text style={styles.trailerText}>{media.trailer.site}</Text>
            </View>
            <Image
              source={{ uri: media.trailer.thumbnail }}
              style={styles.trailerThumbnail}
            />
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const htmlStyles = {
  p: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Arial',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginRight: 5,
  },
  detailsText: {
    fontSize: 18,
    color: '#888',
  },
  staffContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  staffText: {
    fontSize: 16,
    color: '#888',
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  studiosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  studiosText: {
    fontSize: 16,
    color: '#888',
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    marginBottom: 10,
  },
  trailerContainer: {
    marginTop: 20,
  },
  trailerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  trailerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginRight: 5,
  },
  trailerText: {
    fontSize: 18,
    color: '#888',
  },
  trailerThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default DetailedNewsScreen;
