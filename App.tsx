import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TabNavigator from './src/Navigation';
import { ApolloProvider } from '@apollo/client';
import { useFonts } from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LOAD_FONTS } from './src/utils';
import client from './src/graphql/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import Background from './src/components/ui-components/Background';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts(LOAD_FONTS);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Background>
        <StatusBar style="dark" />

        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <ApolloProvider client={client}>
            <NavigationContainer>
              <TabNavigator />
            </NavigationContainer>
          </ApolloProvider>
        </View>
        <FlashMessage
          position="top"
          style={styles.errorStyle}
          duration={3000}
        />
      </Background>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorStyle: {
    top: 80,
    borderRadius: 30,
    fontFamily: 'extra-bold',
  },
});
