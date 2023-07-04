import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const tagsStyles = {
  a: {
    textDecorationLine: 'none',
  },
};

const WebDisplay = ({ html }) => {
  const { width: contentWidth } = useWindowDimensions();
  return <RenderHTML contentWidth={contentWidth} source={{ html }} />;
};

export default WebDisplay;
