import { InMemoryCache, Reference } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn() {
          return isLoggedInVar();
        },

        cartItems() {
          return cartItemsVar();
        },
        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches: Reference[] = [];
            if (existing && existing.launches) {
              launches = launches.concat(existing.launches);
            }
            if (incoming && incoming.launches) {
              launches = launches.concat(incoming.launches);
            }
            return {
              ...incoming,
              launches,
            };
          }
        }
      }
    }
  }
});

// Query.isLoggedIn(), Query.cartItems(), Query.launches

export const isLoggedInVar = cache.makeVar<boolean>(!!localStorage.getItem('token'));
export const cartItemsVar = cache.makeVar<string[]>([]);

// https://www.apollographql.com/docs/tutorial/local-state/
// https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#storing-local-state-in-reactive-variables