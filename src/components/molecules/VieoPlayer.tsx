import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { WINDOW_WIDTH } from '../../utils';

export default function VideoPlayer({ id }: { id: string }) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({
    isPlaying: false,
  });
  return (
    <View
      style={{
        flex: 1,
        height: WINDOW_WIDTH,
        width: WINDOW_WIDTH,
      }}
    >
      <WebView
        androidLayerType={'hardware'}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: `https://www.youtube.com/embed/${id}` }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
