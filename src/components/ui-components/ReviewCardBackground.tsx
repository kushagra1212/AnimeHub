import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
const FROM_COLOR = 'rgba(142, 45, 226, 1)';
const TO_COLOR = 'rgba(103, 28, 202, 1)';

const ReviewCardBackground = ({ children }) => {
  return (
    <View style={[{ flex: 1, zIndex: 5 }, StyleSheet.absoluteFillObject]}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={FROM_COLOR} />
            <Stop offset="1" stopColor={TO_COLOR} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
};

export default ReviewCardBackground;
