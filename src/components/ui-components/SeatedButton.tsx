import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';
const SeatedButton = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress,
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
  const roundedRectWidth = canvasWidth - 20;
  const roundedRectHeight = canvasHeight - 20;

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
        zIndex: 100,
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
          r={32}
          x={canvasWidth / 2 - roundedRectWidth / 2}
          y={canvasHeight / 2 - roundedRectHeight / 2}
          color="#6713D9"
        >
          <Shadow dx={-1} dy={-1} blur={2} color="#777777" />
          <Shadow dx={2} dy={2} blur={10} color="#000000" />
          <Shadow dx={3} dy={3} blur={0} color="#8E2DE2" inner />
          <Shadow dx={-3} dy={-3} blur={0} color="#5602C8" inner />
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
    </TouchableOpacity>
  );
};

export default SeatedButton;
