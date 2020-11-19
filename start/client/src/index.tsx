import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  useQuery,
  gql,
  HttpLink,
  InMemoryCache
} from "@apollo/client";
import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import Login from './pages/login';
import injectStyles from "./styles";
import { cache, 
  isLoggedInVar, cartItemsVar 
} from "./cache";

// Initialize ApolloClient

import { resolvers, typeDefs } from "./resolvers";

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  typeDefs,
  resolvers,
});

// useEffect(() => {
  isLoggedInVar(!!localStorage.getItem('token'));
  cartItemsVar([])

  console.log(isLoggedInVar())
// }, [])



// cache.writeData({
//   data: {
//     isLoggedIn: !!localStorage.getItem('token'),
//     cartItems: [],
//   },
// });



const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;
function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  console.log(data);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

/**
 * Our server can ignore the token when resolving operations that don't
 * require it (such as fetching the list of launches), so it's fine
 * for our client to include the token in every request.
 */

injectStyles();
ReactDOM.render(
  
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById('root'),
);