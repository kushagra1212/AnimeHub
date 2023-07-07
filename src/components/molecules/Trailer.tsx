import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme';
import VideoPlayer from './VieoPlayer';

const Trailer = ({ trailerId }: { trailerId: string }) => {
  if (!trailerId) return null;

  return (
    <View style={styles.trailerContainer}>
      <Text style={styles.subtitle}>Trailer</Text>
      <View style={styles.trailerDetails}>
        <VideoPlayer id={trailerId} />
      </View>
      {/* <Image
        source={{ uri: trailer.thumbnail }}
        style={styles.trailerThumbnail}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  trailerContainer: {
    marginTop: -10,
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
  subtitle: {
    fontSize: 20,
    fontFamily: 'semi-bold',
    marginTop: 20,
    color: COLORS.white,
    marginBottom: 10,
  },
});

export default Trailer;
