import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import AnimeNewsFeedScreen from '../screens/News/AnimeNewsFeedScreen';
import DetailedNewsScreen from '../screens/News/DetailedNewsScreen';
import CharacterDetailsScreen from '../screens/Character/CharacterDetailsScreen';
import AnimeDetailsScreen from '../screens/Anime/AnimeDetailsScreen';
import AnimeScreen from '../screens/Anime/AnimeScreen';
import AnimeSearchScreen from '../screens/Anime/AnimeSearchScreen';
import CharacterScreen from '../screens/Character/CharacterScreen';
const Stack = createNativeStackNavigator();
import { RegisteredStyle, View, ViewStyle } from 'react-native';
import {
  AnimeTabBarIcon,
  CharacterTabBarIcon,
  NewsTabBarIcon,
} from '../components/organs/tab-bar-icons';
import Animated from 'react-native-reanimated';
import { tabBarStyle } from '../utils';
export type NewsStackParamList = {
  AnimeNewsFeedScreen: undefined;
  DetailedNewsScreen: { mediaId: string };
};

export type NewsStackScreenProps = {
  navigation: NativeStackNavigationProp<NewsStackParamList>;
  route: RouteProp<NewsStackParamList, 'DetailedNewsScreen'>;
};

const NewsStackScreen: React.FC<NewsStackScreenProps> = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AnimeNewsFeedScreen"
    >
      <Stack.Screen
        name="AnimeNewsFeedScreen"
        component={AnimeNewsFeedScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="DetailedNewsScreen"
        component={DetailedNewsScreen}
      />
    </Stack.Navigator>
  );
};

export type CharacterSearchStackParamList = {
  CharacterScreen: undefined;
  CharacterSearchScreen: undefined;

  CharacterDetailsScreen: { characterId: string };
};

export type CharacterSearchStackScreenProps = {
  navigation: NativeStackNavigationProp<CharacterSearchStackParamList>;
  route: RouteProp<CharacterSearchStackParamList, 'CharacterDetailsScreen'>;
};

const CharactersSearchStackScreen: React.FC<
  CharacterSearchStackScreenProps
> = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="CharacterScreen"
  >
    <Stack.Screen name="CharacterScreen" component={CharacterScreen} />

    <Stack.Screen
      options={{ headerShown: true }}
      name="CharacterDetailsScreen"
      component={CharacterDetailsScreen}
    />
  </Stack.Navigator>
);

export type AnimeStackParamList = {
  AnimeScreen: undefined;
  AnimeSearchScreen: undefined;
  AnimeDetailsScreen: { mediaId: string };
};

export type AnimeStackScreenProps = {
  navigation: NativeStackNavigationProp<AnimeStackParamList>;
  route: RouteProp<AnimeStackParamList, 'AnimeDetailsScreen'>;
};

const AnimeStackScreen: React.FC<AnimeStackScreenProps> = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="AnimeScreen"
  >
    <Stack.Screen name="AnimeScreen" component={AnimeScreen} />
    <Stack.Screen name="AnimeSearchScreen" component={AnimeSearchScreen} />
    <Stack.Screen
      options={{ headerShown: false }}
      name="AnimeDetailsScreen"
      component={AnimeDetailsScreen}
    />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

export type TabNavigatorScreenProps = {};
const TabNavigator: React.FC<TabNavigatorScreenProps> = ({}) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: tabBarStyle,
      tabBarLabel(props) {
        return null;
      },
      tabBarIconStyle: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }}
    initialRouteName="News"
  >
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => <NewsTabBarIcon focused={focused} />,
      }}
      name="News"
      component={NewsStackScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => <CharacterTabBarIcon focused={focused} />,
      }}
      name="Characters"
      component={CharactersSearchStackScreen}
    />
    <Tab.Screen
      options={{
        tabBarIcon: ({ focused }) => <AnimeTabBarIcon focused={focused} />,
      }}
      name="Anime"
      component={AnimeStackScreen}
    />
  </Tab.Navigator>
);

export default TabNavigator;
