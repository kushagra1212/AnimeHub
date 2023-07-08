import { ApolloClient, DefaultOptions, InMemoryCache } from '@apollo/client';
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};
const client = new ApolloClient({
  defaultOptions: defaultOptions,
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          Page: {
            keyArgs: false,
            merge: (existing, incoming) => {
              return incoming;
            },
          },
          Media: {
            keyArgs: false,
            merge: (existing, incoming) => {
              return incoming;
            },
          },
          media: {
            keyArgs: false,
            merge: (existing, incoming) => {
              return incoming;
            },
          },
          characters: {
            keyArgs: false,
            merge: (existing, incoming) => {
              return incoming;
            },
          },
          Character: {
            keyArgs: false,
            merge: (existing, incoming) => {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
