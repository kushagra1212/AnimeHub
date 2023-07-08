import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@apollo/client';
import RenderHTML from 'react-native-render-html';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsStackParamList } from '../../Navigation';
import { Media } from '../../types';
import { GET_NEWS_DETAILS } from '../../graphql/queries/news-queries';
import { WINDOW_WIDTH, tabBarStyle } from '../../utils';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Dimensions } from 'react-native';
import Background from '../../components/ui-components/Background';
import { ImageCardNeon } from '../../components/ui-components/ImageCard';
import { FlashList } from '@shopify/flash-list';
import StickButton from '../../components/ui-components/StickButton';
import NewsCardContent from '../../components/organs/NewsCardContent';
import Trailer from '../../components/molecules/Trailer';
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
      <Background>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0DD9FA" />
        </View>
      </Background>
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
                  grayBlur={5}
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
                  contentWidth={300 - 40}
                  source={{ html: media.description }}
                  tagsStyles={htmlStyles}
                  baseStyle={styles.description}
                />
              </View>
            ) : null}
            <NewsCardContent
              endDate={media?.endDate}
              startDate={media?.startDate}
              episodes={media?.episodes}
              source={media?.source}
            />
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
                  <Text key={node.id} style={styles.staffText}>
                    {node.name}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
          <Trailer trailerId={media?.trailer?.id} />
        </ScrollView>
      </View>
    </Background>
  );
};

export const htmlStyles = {
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
    height: SCREEN_HEIGHT - 400,
    overflow: 'scroll',
    width: WINDOW_WIDTH - 30,
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
    marginTop: 20,
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
    elevation: 10,
  },
  staffText: {
    fontSize: 16,
    color: COLORS.white,
    marginRight: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: COLORS.blackSecondary,
    fontFamily: 'thin',
  },
  studiosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'semi-bold',
    marginTop: 20,
    color: COLORS.white,
    marginBottom: 10,
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
  topContainer: {
    marginTop: 300,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default DetailedNewsScreen;
