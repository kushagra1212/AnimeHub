import { Dimensions, View } from 'react-native';
import { LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { memo } from 'react';
const Shadder = () => {
  return (
    <View
      style={{
        height: 100,
        position: 'absolute',
        width: SCREEN_WIDTH,
        zIndex: 1,
      }}
    >
      <View
        style={{
          height: 200,
          position: 'absolute',
          width: '100%',
          top: -160,
        }}
      >
        <Svg height="100%" width="100%">
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#3E424B" stopOpacity="0.75" />
            <Stop offset="0.25" stopColor="#3E424B" stopOpacity="1" />
            <Stop offset="0.75" stopColor="#2E3136" stopOpacity="1" />

            <Stop offset="0.85" stopColor="#2E3136" stopOpacity="1" />
            <Stop offset="1" stopColor="#2E3136" stopOpacity="0" />
          </LinearGradient>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
        </Svg>
      </View>
    </View>
  );
};

export default memo(Shadder);
