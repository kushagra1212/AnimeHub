import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { memo } from 'react';
const StickButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress = (event: GestureResponderEvent) => null,
  grayBlur = 12,
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  grayBlur?: number;
}) => {
  const roundedRectWidth = canvasWidth - 20;
  const roundedRectHeight = canvasHeight - 20;

  return (
    <View
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transform: [
          {
            translateX: -canvasWidth / 2 + dx,
          },
          {
            translateY: -canvasHeight / 2 + dy,
          },
        ],
        marginRight: 10,
      }}
    >
      <Canvas
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'absolute',
          marginRight: 10,
          backgroundColor: 'transparent',
        }}
      >
        <RoundedRect
          width={roundedRectWidth}
          height={roundedRectHeight}
          r={32}
          x={canvasWidth / 2 - roundedRectWidth / 2}
          y={canvasHeight / 2 - roundedRectHeight / 2}
          color="#222225"
        >
          <Shadow dx={2} dy={2} blur={1} color="#000000" inner />
          <Shadow dx={5} dy={5} blur={5} color="#444444" inner />
          <Shadow dx={-5} dy={-5} blur={grayBlur} color="#777777" />
          <Shadow dx={-4} dy={-4} blur={5} color="#000000" inner />
        </RoundedRect>
      </Canvas>
      <Text
        style={{
          color: textColor,
          marginTop: canvasHeight / 2 - 12,
          alignSelf: 'center',
          fontFamily: textFontFamily,
          justifyContent: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export const StickFilterButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress = (event: GestureResponderEvent) => null,
  isActive,
  colors = ['#0DD9FA', '#11B3D1'],
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  isActive: boolean;
  colors?: string[];
}) => {
  const roundedRectWidth = canvasWidth - 60;
  const roundedRectHeight = canvasHeight - 60;
  textColor = isActive ? 'white' : 'white';
  return (
    <View
      style={{
        width: canvasWidth,
        height: canvasHeight,
        transform: [
          {
            translateX: -canvasWidth / 2 + dx,
          },
          {
            translateY: -canvasHeight / 2 + dy,
          },
        ],
      }}
      onTouchEnd={onPress}
    >
      <Canvas
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'absolute',
          marginRight: 10,
          backgroundColor: 'transparent',
        }}
      >
        {isActive ? (
          <RoundedRect
            width={roundedRectWidth}
            height={roundedRectHeight}
            r={32}
            x={canvasWidth / 2 - roundedRectWidth / 2}
            y={canvasHeight / 2 - roundedRectHeight / 2}
            color={colors[0]}
          >
            <Shadow dx={2} dy={2} blur={1} color="#000000" inner />
            <Shadow dx={5} dy={5} blur={5} color={colors[1]} inner />
            <Shadow dx={-3} dy={-3} blur={3} color={colors[1]} />
            <Shadow dx={-4} dy={-4} blur={5} color="#000000" inner />
          </RoundedRect>
        ) : (
          <RoundedRect
            width={roundedRectWidth}
            height={roundedRectHeight}
            r={32}
            x={canvasWidth / 2 - roundedRectWidth / 2}
            y={canvasHeight / 2 - roundedRectHeight / 2}
            color="#222225"
          >
            <Shadow dx={2} dy={2} blur={1} color="#000000" inner />
            <Shadow dx={5} dy={5} blur={5} color="#444444" inner />
            <Shadow dx={-3} dy={-3} blur={5} color="#666666" />
            <Shadow dx={-4} dy={-4} blur={5} color="#000000" inner />
          </RoundedRect>
        )}
      </Canvas>
      <Text
        style={{
          color: textColor,
          marginTop: canvasHeight / 2 - 12,
          alignSelf: 'center',
          fontFamily: textFontFamily,
          justifyContent: 'center',
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default StickButton;
