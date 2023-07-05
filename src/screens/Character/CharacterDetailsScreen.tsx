import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CharacterSearchStackParamList } from '../../Navigation';
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { memo } from 'react';
import { GET_CHARACTER_DETAILS } from '../../graphql/queries/character-queries';
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
        navigation.setOptions({
          title: data?.Character?.name.full,
        });
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
      }
    }
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [data]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
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
    <ScrollView style={styles.container}>
      <Image style={styles.coverImage} source={{ uri: image.large }} />
      <Text style={styles.title}>{name.full}</Text>
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
      {description && (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldTitle}>Description</Text>
          <Text style={styles.fieldValue}>{description}</Text>
        </View>
      )}
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
        <Text style={styles.fieldTitle}>Media</Text>
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
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  coverImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  fieldValue: {
    color: '#666',
    fontSize: 14,
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  mediaImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
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
});
export default memo(CharacterDetailsScreen);
