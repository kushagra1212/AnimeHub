import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import TabNavigator from './src/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
LogBox.ignoreLogs([
  'Cache data may be lost when replacing the Page field of a Query object.',
]);

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />

      <ApolloProvider client={client}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ApolloProvider>
    </SafeAreaView>
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
