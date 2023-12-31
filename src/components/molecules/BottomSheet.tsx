import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useImperativeHandle, useRef } from 'react';
import { forwardRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useImage } from '@shopify/react-native-skia';
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
              velocity: 50,
            }),
          },
        ],
        bottom: withSpring(bottom.value, {
          damping: 20,
          velocity: 50,
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
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent',
            }}
          >
            <WebView
              style={{ flex: 1, backgroundColor: 'transparent' }}
              originWhitelist={['*']}
              source={{
                html: `<div style="
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.17);
        backdrop-filter: blur(30px);
        "/>`,
              }}
            />
          </View>
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
