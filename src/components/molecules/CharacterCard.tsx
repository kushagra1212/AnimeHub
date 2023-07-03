import React, { memo } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CharacterCard = ({ item, navigation }) => {
  const {
    age,
    bloodType,
    description,
    favourites,
    gender,
    id,
    image,
    name,
    media,
  } = item;

  return (
    <TouchableOpacity
      style={characterCardStyles.characterCard}
      onPress={() =>
        navigation.navigate('CharacterDetailsScreen', { characterId: id })
      }
    >
      <Image
        style={characterCardStyles.coverImage}
        source={{ uri: image.large }}
      />
      <View style={characterCardStyles.infoContainer}>
        <Text style={characterCardStyles.title}>{name.full}</Text>
        <View style={characterCardStyles.fieldContainer}>
          <Text style={characterCardStyles.fieldTitle}>Age:</Text>
          <Text style={characterCardStyles.fieldValue}>{age}</Text>
        </View>
        <View style={characterCardStyles.fieldContainer}>
          <Text style={characterCardStyles.fieldTitle}>Blood Type:</Text>
          <Text style={characterCardStyles.fieldValue}>
            {bloodType || 'Unknown'}
          </Text>
        </View>
        <View style={characterCardStyles.fieldContainer}>
          <Text style={characterCardStyles.fieldTitle}>Favourites:</Text>
          <Text style={characterCardStyles.fieldValue}>{favourites}</Text>
        </View>
        <View style={characterCardStyles.fieldContainer}>
          <Text style={characterCardStyles.fieldTitle}>Gender:</Text>
          <Text style={characterCardStyles.fieldValue}>{gender}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const characterCardStyles = StyleSheet.create({
  characterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  fieldContainer: {
    marginBottom: 8,
  },
  fieldTitle: {
    fontWeight: 'bold',
    color: '#333333',
  },
  fieldValue: {
    color: '#666666',
  },
});
export default memo(CharacterCard);
