import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import RenderHTML from 'react-native-render-html';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { Media } from '../../types';
import { memo } from 'react';
import { GET_NEWS_DETAILS } from '../../graphql/queries/news-queries';
import { WINDOW_HEIGHT, WINDOW_WIDTH, tabBarStyle } from '../../utils';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Dimensions } from 'react-native';
import Background from '../../components/ui-components/Background';
import { ImageCardNeon } from '../../components/ui-components/ImageCard';
import { FlashList } from '@shopify/flash-list';
import StickButton from '../../components/ui-components/StickButton';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
type DetailedNewsScreenProps = {
  route: {
    params: {
      mediaId: string;
    };
  };
  navigation: NativeStackNavigationProp<NewsStackParamList>;
};

const DetailedNewsScreen: React.FC<DetailedNewsScreenProps> = ({
  route,
  navigation,
}) => {
  const { mediaId } = route.params;
  const { loading, error, data } = useQuery(GET_NEWS_DETAILS, {
    variables: {
      mediaId: mediaId,
    },
  });

  useEffect(() => {
    if (navigation && data?.Media) {
      navigation.setOptions({
        title: data.Media.title.english,
      });
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          ...tabBarStyle,
          display: 'none',
        },
      });
    }
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
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
  const goBackHandler = () => {
    navigation.goBack();
  };
  const media: Media = data?.Media;

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
            source={{ uri: media.coverImage.extraLarge }}
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

        <View style={styles.topContainer}>
          <Text style={styles.title}>{data.Media.title.english}</Text>
          <View
            style={{
              position: 'relative',
              marginLeft: 0,
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <FlashList
              data={media.genres}
              estimatedItemSize={100}
              horizontal
              renderItem={({ item }: { item: string }) => (
                <StickButton
                  text={item}
                  canvasHeight={60}
                  canvasWidth={item.length * 25}
                  dx={(item.length * 25) / 2}
                  dy={30}
                  textColor="white"
                  textFontFamily="semi-bold"
                />
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.detailsContainer}>
            {media?.description ? (
              <View>
                <Text style={styles.subtitle}>Description</Text>

                <RenderHTML
                  contentWidth={300}
                  source={{ html: media.description }}
                  tagsStyles={htmlStyles}
                  baseStyle={styles.description}
                />
              </View>
            ) : null}
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
      </View>
    </Background>
  );
};

const htmlStyles = {
  p: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.white,
    fontFamily: 'Arial',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'absolute',
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
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  content: {
    height: SCREEN_HEIGHT - 410,
    overflow: 'scroll',
  },
  title: {
    fontSize: 24,
    fontFamily: 'extra-bold',
    color: COLORS.white,
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
    fontFamily: 'semi-bold',
    marginTop: 20,
    color: COLORS.white,
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
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.white,
    fontFamily: 'medium',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'justify',
  },
  topContainer: {
    marginTop: 300,
  },
});

export default DetailedNewsScreen;
