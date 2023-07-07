import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { memo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme';

const AnimeCard = ({ item, navigation }) => {
  const { coverImage, title, genres, tags, rankings } = item;

  return (
    <View style={animeCardStyles.animeCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AnimeDetailsScreen', { mediaId: item.id })
        }
      >
        <Image
          style={animeCardStyles.coverImage}
          source={{ uri: coverImage.extraLarge }}
        />
        <View style={animeCardStyles.infoContainer}>
          <Text style={animeCardStyles.title}>{title.english}</Text>
          {genres.length > 0 && (
            <Text style={animeCardStyles.genres}>
              Genres: {genres.join(', ')}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {rankings.length > 0 ? (
        <View style={animeCardStyles.infoContainer}>
          <Text style={animeCardStyles.rankingsTitle}>Rankings:</Text>
          <FlatList
            data={rankings}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: any }) => (
              <Text style={animeCardStyles.ranking}>
                {item.type} - {item.format}
              </Text>
            )}
          />
        </View>
      ) : null}
      {tags.length > 0 ? (
        <View style={animeCardStyles.tagsContainer}>
          <Text style={animeCardStyles.tagsTitle}>Tags:</Text>
          <FlashList
            data={tags}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: any }) => (
              <Text style={animeCardStyles.tag}>{item.name}</Text>
            )}
            estimatedItemSize={100}
          />
        </View>
      ) : null}
    </View>
  );
};

const animeCardStyles = StyleSheet.create({
  animeCard: {
    backgroundColor: '#222222',
    borderRadius: 16,
    marginTop: 25,
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
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    color: COLORS.white,
    fontFamily: 'extra-bold',
  },
  genres: {
    fontSize: 16,
    marginBottom: 12,
    color: COLORS.white,
    fontFamily: 'extra-bold',
    opacity: 0.5,
  },
  rankingsTitle: {
    fontSize: 18,
    marginBottom: 6,
    color: COLORS.white,
    fontFamily: 'semi-bold',
    opacity: 0.9,
  },
  ranking: {
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.white,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.blackSecondary,
    fontFamily: 'thin',
    marginRight: 12,
  },
  tagsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#777777',
    padding: 16,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.white,
  },
  tagsFlatList: {
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 16,
    color: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    backgroundColor: COLORS.blackSecondary,
    fontFamily: 'thin',
    marginRight: 12,
  },
});

export default AnimeCard;
