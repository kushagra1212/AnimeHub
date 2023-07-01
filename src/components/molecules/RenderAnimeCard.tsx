import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const AnimeCard = ({ item, navigation }) => {
  const { coverImage, title, genres, tags, rankings } = item;

  return (
    <TouchableOpacity
      style={animeCardStyles.animeCard}
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

        {rankings.length > 0 ? (
          <View>
            <Text style={animeCardStyles.rankingsTitle}>Rankings:</Text>
            <FlatList
              data={rankings}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Text style={animeCardStyles.ranking}>
                  {item.type} - {item.format}
                </Text>
              )}
              contentContainerStyle={animeCardStyles.rankingsContainer}
            />
          </View>
        ) : null}
      </View>
      {tags.length > 0 && (
        <View style={animeCardStyles.tagsContainer}>
          <Text style={animeCardStyles.tagsTitle}>Tags:</Text>
          <FlatList
            data={tags}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Text style={animeCardStyles.tag}>{item.name}</Text>
            )}
            contentContainerStyle={animeCardStyles.tagsFlatList}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const animeCardStyles = StyleSheet.create({
  animeCard: {
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
  genres: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666666',
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333333',
  },
  ranking: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666666',
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
  },
  rankingsContainer: {
    paddingTop: 8,
  },
  tagsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    padding: 16,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  tagsFlatList: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  tag: {
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
});

export default AnimeCard;
