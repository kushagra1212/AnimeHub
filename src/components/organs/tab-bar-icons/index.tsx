import { InwardButton } from '../../ui-components/CircularButton';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { View } from 'react-native';
export const NewsTabBarIcon = ({
  focused,
}: {
  focused: boolean;
}): JSX.Element => {
  return (
    <View
      style={{
        position: 'relative',
        height: 100,
        width: 100,
      }}
    >
      <InwardButton
        focused={focused}
        canvasHeight={100}
        canvasWidth={100}
        dx={50}
        dy={50}
      >
        <Ionicons
          name="md-newspaper-sharp"
          size={40}
          color={focused ? 'rgba(13, 217, 255, 0.89)' : '#888'}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
      </InwardButton>
    </View>
  );
};
export const CharacterTabBarIcon = ({
  focused,
}: {
  focused: boolean;
}): JSX.Element => {
  return (
    <View
      style={{
        position: 'relative',
        height: 100,
        width: 100,
      }}
    >
      <InwardButton
        focused={focused}
        canvasHeight={100}
        canvasWidth={100}
        dx={50}
        dy={50}
      >
        <Octicons
          name="feed-person"
          size={40}
          color={focused ? 'rgba(13, 217, 255, 0.89)' : '#888'}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
      </InwardButton>
    </View>
  );
};
export const AnimeTabBarIcon = ({
  focused,
}: {
  focused: boolean;
}): JSX.Element => {
  return (
    <View
      style={{
        position: 'relative',
        height: 100,
        width: 100,
      }}
    >
      <InwardButton
        focused={focused}
        canvasHeight={100}
        canvasWidth={100}
        dx={50}
        dy={50}
      >
        <MaterialCommunityIcons
          name="card-text"
          size={50}
          color={focused ? 'rgba(13, 217, 255, 0.89)' : '#888'}
          style={{
            marginTop: 25,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
      </InwardButton>
    </View>
  );
};
