import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, LogBox, StyleSheet, Text, View } from 'react-native';
import TabNavigator from './src/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LOAD_FONTS } from './src/utils';
import client from './src/graphql/client';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts(LOAD_FONTS);

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
