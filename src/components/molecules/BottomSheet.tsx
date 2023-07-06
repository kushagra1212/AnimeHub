import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useImperativeHandle, useRef } from 'react';
import { COLORS } from '../../theme';
import { forwardRef, useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { memo } from 'react';
import {
  Blur,
  BlurMask,
  Box,
  Canvas,
  RoundedRect,
  Shadow,
  rect,
  rrect,
  Circle,
  Image as SkiaImage,
  useImage,
} from '@shopify/react-native-skia';
import WebView from 'react-native-webview';
const { width: SCREEN_WIDTH, height: SCREEEN_HEIGHT } =
  Dimensions.get('window');

type BottomSheetProps = {
  children: React.ReactNode;
  bottomSheetToggle: () => void;
};
export type BottomSheetRef = {
  showBottomSheet: () => void;
  hideBottomSheet: () => void;
  isActive: () => boolean;
};

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, bottomSheetToggle }, ref) => {
    const contextY = useSharedValue(SCREEEN_HEIGHT);
    const offsetY = useSharedValue(0);
    const bottom = useSharedValue(-SCREEEN_HEIGHT);
    let isActived = useRef(false).current;
    const showBottomSheet = () => {
      isActived = true;
      offsetY.value = -SCREEEN_HEIGHT / 2;
    };

    const hideBottomSheet = () => {
      offsetY.value = 0;
      bottom.value = -SCREEEN_HEIGHT;
      isActived = false;
    };
    useImperativeHandle(ref, () => ({
      showBottomSheet,
      hideBottomSheet,
      isActive: () => isActived,
    }));
    const AnimatedBottomSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(offsetY.value, {
              damping: 20,
              velocity: 0.1,
            }),
          },
        ],
        bottom: withSpring(bottom.value, {
          damping: 20,
        }),
      };
    });
    const gesture = Gesture.Pan()
      .onBegin((e) => {
        contextY.value = offsetY.value;
      })
      .onUpdate((e) => {
        offsetY.value = e.translationY + contextY.value;
      })
      .onEnd(() => {
        if (offsetY.value <= -SCREEEN_HEIGHT / 2) {
          offsetY.value = -SCREEEN_HEIGHT;
        } else if (offsetY.value >= -SCREEEN_HEIGHT / 2) {
          runOnJS(bottomSheetToggle)();
        }
      })
      .onFinalize(() => {});
    const image = useImage(require('../../../assets/transparent.png'));
    if (!image) {
      return null;
    }
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.sheetContainer, AnimatedBottomSheetStyle]}
        >
          <Canvas
            style={{
              flex: 1,
              position: 'absolute',
              height: SCREEEN_HEIGHT,
              width: SCREEN_WIDTH,
              backgroundColor: 'black',
              top: 0,
              opacity: 0.5,
            }}
          >
            <SkiaImage
              x={0}
              y={-SCREEEN_HEIGHT / 4}
              width={SCREEN_WIDTH}
              height={SCREEEN_HEIGHT}
              image={image}
            >
              <Blur blur={10} />
            </SkiaImage>
          </Canvas>
          <View style={styles.wrapper}>
            <View style={styles.dragger} />
            <View style={styles.content}>{children}</View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);
const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
    width: SCREEN_WIDTH,
    height: SCREEEN_HEIGHT,
    zIndex: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  wrapper: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    // justifyContent: 'center',
    alignItems: 'center',
  },
  dragger: {
    width: 50,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10,
  },
  content: {
    width: '100%',
  },
});

export default BottomSheet;
