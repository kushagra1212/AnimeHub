import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import BackgroundCard from '../ui-components/BackgroundCard';
import RenderHTML from 'react-native-render-html';
import { Text } from 'react-native';
import SeatedButton from '../ui-components/SeatedButton';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme';
const { width, height } = Dimensions.get('window');
import { memo } from 'react';
import StickButton from '../ui-components/StickButton';
import { FlashList } from '@shopify/flash-list';
import WebDisplay from './WebDisplay';
const baseStyleHtmlDesc = {
  fontSize: 15,
  color: COLORS.GraySecondary,
  width: '100%',
  padding: 10,
};
const NewsCard = ({ item, handleNewsItemPress }) => {
  let description = item.description || '';

  if (description && description?.length > 150) {
    description = `${description?.slice(0, 150)}...`;
  }

  const canvasWidth = width;
  const canvasHeight = 450;
  const roundedRectWidth = canvasWidth - 30;
  const roundedRectHeight = canvasHeight - 30;
  const source = item.source === 'ORIGINAL' ? 'Verified' : 'Manga';
  return (
    <View
      style={{
        width: canvasWidth,
        height: canvasHeight,
        marginVertical: 10,
      }}
    >
      <BackgroundCard
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        roundedRectHeight={roundedRectHeight}
        roundedRectWidth={roundedRectWidth}
      />

      <View
        style={[
          styles.card,
          {
            position: 'absolute',
            width: roundedRectWidth,
            height: roundedRectHeight,
            top: canvasWidth / 2 - roundedRectWidth / 2,
            left: 20,
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          },
        ]}
      >
        <Text style={styles.title}>{item.title.english}</Text>

        <RenderHTML
          contentWidth={200}
          baseStyle={baseStyleHtmlDesc}
          source={{ html: item.description?.slice(0, 150) }}
        />
        {description && description?.length > 150 ? (
          <View
            style={{
              height: 50,
            }}
          >
            <SeatedButton
              dx={70 + 34}
              dy={20}
              canvasHeight={60}
              canvasWidth={140}
              text="Read More"
              textColor="white"
              textFontFamily="semi-bold"
              onPress={() => handleNewsItemPress(item)}
            />
            <Ionicons
              style={{ opacity: 0.5 }}
              name="reader"
              size={30}
              color="white"
            />
          </View>
        ) : null}

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
            data={item.genres}
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
        {item.episodes ? (
          <Text
            style={{
              color: COLORS.white,
              opacity: 0.5,
              fontFamily: 'medium',
              fontSize: SIZES.body3,
              textAlign: 'right',
              marginRight: 10,
            }}
          >
            Episodes: {item.episodes}{' '}
            <FontAwesome name="th-list" size={20} color="white" />
          </Text>
        ) : null}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          {source ? (
            <View>
              <Text style={styles.cardValue}>{source}</Text>
              <Text style={styles.cardKey}>Source</Text>
            </View>
          ) : null}

          {item.startDate?.year ? (
            <View>
              <Text style={styles.cardValue}>{item.startDate.year}</Text>
              <Text style={styles.cardKey}>Start Date</Text>
            </View>
          ) : null}
          {item.endDate?.year ? (
            <View>
              <Text style={styles.cardValue}>{item.endDate.year}</Text>
              <Text style={styles.cardKey}>End Date</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightGrayPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: SIZES.h3,
    marginBottom: 5,
    color: COLORS.white,
    margin: 10,
    fontFamily: 'extra-bold',
  },
  cardValue: {
    color: COLORS.white,
    fontFamily: 'semi-bold',
    fontSize: SIZES.h4,
  },
  cardKey: {
    color: COLORS.GrayPrimary,
    fontFamily: 'extra-bold',
    fontSize: SIZES.body3,
    opacity: 0.5,
  },
});
export default NewsCard;
