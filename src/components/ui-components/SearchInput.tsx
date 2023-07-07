import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import { GestureResponderEvent, View } from 'react-native';
import Shadder from './Shadder';

export const SearchInput = ({
  canvasWidth,
  canvasHeight,
  dx,
  dy,
  textColor = 'white',
  textFontFamily = 'regular',
  text = 'hello world',
  onPress = (event: GestureResponderEvent) => null,
  children,
  focused,
  roundedRectWidth = 30,
  roundedRectHeight = 30,
}: {
  canvasWidth: number;
  canvasHeight: number;
  dx: number;
  dy: number;
  textColor?: string;
  textFontFamily?: string;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  focused: boolean;
  roundedRectWidth?: number;
  roundedRectHeight?: number;
}) => {
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
        position: 'absolute',
        zIndex: 3,
      }}
    >
      {focused ? (
        <Canvas
          style={{
            height: canvasHeight,
            width: canvasWidth,
            position: 'absolute',
          }}
        >
          <RoundedRect
            width={roundedRectWidth}
            height={roundedRectHeight}
            r={15}
            x={canvasWidth / 2 - roundedRectWidth / 2}
            y={canvasHeight / 2 - roundedRectHeight / 2}
            color="#111111"
          >
            <Shadow dx={0} dy={0} blur={10} color="#23272A" />
            <Shadow dx={0} dy={0} blur={2} color="#777777" inner />
          </RoundedRect>
          <RoundedRect
            width={(8 * roundedRectWidth) / 10}
            height={(8 * roundedRectHeight) / 10}
            r={10}
            x={canvasWidth / 2 - roundedRectWidth / 2 + roundedRectWidth / 30}
            y={
              canvasHeight / 2 - roundedRectHeight / 2 + roundedRectHeight / 10
            }
            color="#111111"
          >
            <Shadow dx={3} dy={3} blur={3} color="#000000" inner />
            <Shadow dx={-3} dy={-3} blur={2} color="#333333" inner />
          </RoundedRect>
        </Canvas>
      ) : null}

      {children}
    </View>
  );
};
