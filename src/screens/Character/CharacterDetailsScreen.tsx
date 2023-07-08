import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CharacterSearchStackParamList } from '../../Navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { memo } from 'react';
import { GET_CHARACTER_DETAILS } from '../../graphql/queries/character-queries';
import { InwardButtonElevated } from '../../components/ui-components/CircularButton';
import { COLORS } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Background from '../../components/ui-components/Background';
import { WINDOW_HEIGHT, WINDOW_WIDTH, tabBarStyle } from '../../utils';
import { ImageCardNeon } from '../../components/ui-components/ImageCard';
import RenderHTML from 'react-native-render-html';
import { htmlStyles } from '../News/DetailedNewsScreen';
type CharacterDetailsScreenProps = {
  route: {
    params: {
      characterId: string;
    };
  };
  navigation: NativeStackNavigationProp<CharacterSearchStackParamList>;
};

const CharacterDetailsScreen = ({
  route,
  navigation,
}: CharacterDetailsScreenProps) => {
  const { characterId } = route.params;
  const [characterData, setCharacterData] = useState(null);

  const { loading, error, data } = useQuery(GET_CHARACTER_DETAILS, {
    variables: { characterId },
  });

  useEffect(() => {
    if (data && data.Character) {
      setCharacterData(data.Character);
      if (navigation && data?.Character) {
        navigation.getParent()?.setOptions({
          tabBarStyle: { ...tabBarStyle, display: 'none' },
        });
      }
    }
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
      });
    };
  }, [data]);
  const goBackHandler = () => {
    navigation.goBack();
  };
  if (loading) {
    return (
      <Background>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0DD9FA" />
        </View>
      </Background>
    );
  }
  if (!characterData) {
    return null;
  }

  const {
    description,
    favourites,
    gender,
    id,
    image,
    name,
    media,
    age,
    bloodType,
  } = characterData;

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
            source={{ uri: image.large }}
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
          <Text style={styles.title}>{name.full}</Text>

          <ScrollView style={styles.detailsContainer}>
            {age && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Age</Text>
                <Text style={styles.fieldValue}>{age}</Text>
              </View>
            )}
            {bloodType && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Blood Type</Text>
                <Text style={styles.fieldValue}>{bloodType || 'Unknown'}</Text>
              </View>
            )}

            {description ? (
              <View>
                <Text style={styles.subtitle}>Description</Text>

                <RenderHTML
                  contentWidth={300}
                  source={{ html: description }}
                  tagsStyles={htmlStyles}
                  baseStyle={styles.description}
                />
              </View>
            ) : null}
            {favourites && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Favourites</Text>
                <Text style={styles.fieldValue}>{favourites}</Text>
              </View>
            )}
            {gender && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Gender</Text>
                <Text style={styles.fieldValue}>{gender}</Text>
              </View>
            )}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldTitle}>Gallery</Text>
              <ScrollView horizontal>
                <View style={styles.mediaContainer}>
                  {media.nodes.map((item, index) => (
                    <Image
                      key={index.toString()}
                      style={styles.mediaImage}
                      source={{ uri: item.coverImage.extraLarge }}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
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
  topContainer: {
    marginTop: 300,
  },
  coverImage: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'extra-bold',
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 4,
    fontFamily: 'extra-bold',
  },
  fieldValue: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    fontFamily: 'regular',
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  mediaImage: {
    width: 200,
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
  },
  nightModeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#000',
    zIndex: 10,
  },
  nightModeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    color: COLORS.white,
    fontFamily: 'medium',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'justify',
  },
  detailsContainer: {
    marginBottom: 20,
    overflow: 'scroll',
    height: WINDOW_HEIGHT - 320,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
export default memo(CharacterDetailsScreen);
