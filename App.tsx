import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import TabNavigator from './src/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
LogBox.ignoreLogs([
  'Cache data may be lost when replacing the Page field of a Query object.',
]);

SplashScreen.preventAutoHideAsync();
const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'bold-itatic': require('./assets/fonts/JetBrainsMono-BoldItalic.ttf'),
    medium: require('./assets/fonts/JetBrainsMono-Medium.ttf'),
    'semi-bold': require('./assets/fonts/JetBrainsMono-SemiBold.ttf'),
    regular: require('./assets/fonts/JetBrainsMonoNL-Regular.ttf'),
    thin: require('./assets/fonts/JetBrainsMonoNL-Thin.ttf'),
    'extra-light': require('./assets/fonts/JetBrainsMonoNL-ExtraLight.ttf'),
    'extra-bold': require('./assets/fonts/JetBrainsMonoNL-ExtraBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />

      <ApolloProvider client={client}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
