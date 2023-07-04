import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { memo } from 'react';
const CircularButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress = (event: GestureResponderEvent) => null,
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const roundedRectWidth = canvasWidth - 30;
  const roundedRectHeight = canvasHeight - 30;

  return (
    <TouchableOpacity
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
        position: 'absolute',
      }}
      onPress={onPress}
    >
      <Canvas
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'absolute',
          marginRight: 10,
        }}
      >
        <RoundedRect
          width={roundedRectWidth}
          height={roundedRectHeight}
          r={42}
          x={canvasWidth / 2 - roundedRectWidth / 2}
          y={canvasHeight / 2 - roundedRectHeight / 2}
          color="#2F353A"
        >
          <Shadow dx={-3} dy={-3} blur={3} color="#2F353A" inner />
          <Shadow dx={-4} dy={-4} blur={10} color="#555555" />
          <Shadow dx={5} dy={5} blur={5} color="#222222" />
          <Shadow dx={3} dy={3} blur={2} color="#1C1F22" inner />
        </RoundedRect>
      </Canvas>
      <FontAwesome
        style={{
          color: textColor,
          marginTop: canvasHeight / 2 - 15,
          alignSelf: 'center',
          fontFamily: textFontFamily,
          justifyContent: 'center',
        }}
        name="filter"
        size={35}
        color="black"
      />
    </TouchableOpacity>
  );
};
export default CircularButton;