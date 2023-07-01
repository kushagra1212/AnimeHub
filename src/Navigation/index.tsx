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
import CharacterSearchScreen from '../screens/Character/CharacterSearchScreen';
import AnimeScreen from '../screens/Anime/AnimeScreen';
import AnimeSearchScreen from '../screens/Anime/AnimeSearchScreen';

const Stack = createNativeStackNavigator();

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
          headerShown: true,
        }}
        name="DetailedNewsScreen"
        component={DetailedNewsScreen}
      />
    </Stack.Navigator>
  );
};

export type CharacterSearchStackParamList = {
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
    initialRouteName="CharacterSearchScreen"
  >
    <Stack.Screen
      name="CharacterSearchScreen"
      component={CharacterSearchScreen}
    />
    <Stack.Screen
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
const TabNavigator: React.FC<TabNavigatorScreenProps> = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="News"
  >
    <Tab.Screen name="News" component={NewsStackScreen} />
    <Tab.Screen name="Characters" component={CharactersSearchStackScreen} />
    <Tab.Screen name="Anime" component={AnimeStackScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
