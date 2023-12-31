import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import { GestureResponderEvent, View } from 'react-native';

export const ImageCardNeon = ({
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
        zIndex: -1,
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
            r={10}
            x={canvasWidth / 2 - roundedRectWidth / 2}
            y={canvasHeight / 2 - roundedRectHeight / 2}
            color="#000000"
          >
            <Shadow dx={-6} dy={-6} blur={1} color="#333333" />
            <Shadow dx={-5} dy={-5} blur={1} color="#0DD9FA" />
            <Shadow dx={-2} dy={-2} blur={5} color="#FFFFFF" />
            <Shadow dx={7} dy={7} blur={15} color="#0CC7D0" />
            <Shadow dx={6} dy={6} blur={2} color="#0DD9FA" />
            <Shadow dx={3} dy={3} blur={2} color="#FFFFFF" />

            <Shadow dx={-2} dy={-2} blur={5} color="#FFFFFF" inner />
            <Shadow dx={2} dy={2} blur={5} color="#FFFFFF" inner />
          </RoundedRect>
        </Canvas>
      ) : null}

      {children}
    </View>
  );
};
