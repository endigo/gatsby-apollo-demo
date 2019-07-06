import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

import createApolloClient from "./src/createApolloClient";

const client = createApolloClient();

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>{element}</ApolloHooksProvider>
  </ApolloProvider>
);
