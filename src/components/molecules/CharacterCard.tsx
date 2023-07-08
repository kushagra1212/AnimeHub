import { memo } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../theme';
import { ScrollView } from 'react-native-gesture-handler';

const CharacterCard = ({ item, navigation }) => {
  const { age, bloodType, favourites, gender, id, image, name } = item;

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
        {age ? (
          <ScrollView horizontal style={characterCardStyles.cardValueContainer}>
            <Text style={characterCardStyles.cardKey}>Age:</Text>
            <Text style={characterCardStyles.cardValue}>{age}</Text>
          </ScrollView>
        ) : null}
        {favourites ? (
          <ScrollView horizontal style={characterCardStyles.cardValueContainer}>
            <Text style={characterCardStyles.cardKey}>Favourites:</Text>
            <Text style={characterCardStyles.cardValue}>{favourites}</Text>
          </ScrollView>
        ) : null}
        {gender ? (
          <ScrollView horizontal style={characterCardStyles.cardValueContainer}>
            <Text style={characterCardStyles.cardKey}>Gender:</Text>
            <Text style={characterCardStyles.cardValue}>{gender}</Text>
          </ScrollView>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const characterCardStyles = StyleSheet.create({
  characterCard: {
    backgroundColor: '#222222',
    borderRadius: 16,
    marginTop: 20,
    elevation: 10,
    shadowColor: '#777777',
    shadowRadius: 4,
    width: '90%',
    marginLeft: '5%',
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#333333',
    opacity: 0.8,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
    display: 'flex',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    color: COLORS.white,
    fontFamily: 'extra-bold',
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
  cardValue: {
    color: COLORS.white,
    fontFamily: 'semi-bold',
    fontSize: SIZES.h4,
    opacity: 0.7,
  },
  cardKey: {
    color: COLORS.GrayPrimary,
    fontFamily: 'extra-bold',
    fontSize: SIZES.body3,
    opacity: 0.5,
    marginRight: 10,
  },
  cardValueContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});
export default memo(CharacterCard);
