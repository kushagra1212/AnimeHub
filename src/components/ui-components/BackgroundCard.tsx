import { Canvas, RoundedRect, Shadow } from '@shopify/react-native-skia';
import { memo } from 'react';
const BackgroundCard = ({
  canvasWidth,
  canvasHeight,
  roundedRectWidth,
  roundedRectHeight,
}: {
  canvasWidth: number;
  canvasHeight: number;
  roundedRectWidth: number;
  roundedRectHeight: number;
}) => {
  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <RoundedRect
        width={roundedRectWidth}
        height={roundedRectHeight}
        r={50}
        x={canvasWidth / 2 - roundedRectWidth / 2}
        y={canvasHeight / 2 - roundedRectHeight / 2}
        color="#2E3237"
      >
        <Shadow dx={1} dy={1} blur={1} color="#666666" inner />
        <Shadow dx={5} dy={5} blur={4} color="#000000" />
      </RoundedRect>
    </Canvas>
  );
};
export default memo(BackgroundCard);
