import { StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '../../theme';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useMemo } from 'react';
import { getNewsSource } from '../../utils';
const NewsCardContent = ({ episodes, source, startDate, endDate }) => {
  const updatedSource = useMemo(() => getNewsSource(source), [source]);
  return (
    <>
      {episodes ? (
        <Text
          style={{
            color: COLORS.white,
            opacity: 0.5,
            fontFamily: 'medium',
            fontSize: SIZES.body3,
            textAlign: 'right',
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          Episodes: {episodes}{' '}
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
        {updatedSource ? (
          <View>
            <Text style={styles.cardValue}>{updatedSource}</Text>
            <Text style={styles.cardKey}>Source</Text>
          </View>
        ) : null}

        {startDate?.year ? (
          <View>
            <Text style={styles.cardValue}>{startDate.year}</Text>
            <Text style={styles.cardKey}>Start Date</Text>
          </View>
        ) : null}
        {endDate?.year ? (
          <View>
            <Text style={styles.cardValue}>{endDate.year}</Text>
            <Text style={styles.cardKey}>End Date</Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
export default NewsCardContent;
