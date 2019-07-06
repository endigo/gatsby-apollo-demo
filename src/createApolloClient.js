const { HttpLink } = require("apollo-link-http");
const { split } = require("apollo-link");
const { setContext } = require("apollo-link-context");
const { ApolloClient, InMemoryCache } = require("apollo-boost");
const { WebSocketLink } = require("apollo-link-ws");
const { SubscriptionClient } = require("subscriptions-transport-ws");
const { getMainDefinition } = require("apollo-utilities");
const fetch = require("isomorphic-fetch");
const ws = require("ws");

const wsForNode = typeof window === "undefined" ? ws : null;

const getHeaders = async (headers = {}) => {
  const _headers = {
    ...headers
  };

  _headers['x-hasura-role'] = 'admin';

  return _headers;
};

const createApolloClient = options => {
  const _options = {
    ssrMode: false,
    ...options
  };

  const cache = new InMemoryCache().restore({});

  const GRAPHQL_ENDPOINT =
    "https://gatsby-apollo-demo.herokuapp.com/v1/graphql";
  const SUBSCRIPTION_ENDPOINT = GRAPHQL_ENDPOINT.replace("https", "wss");

  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetch
  });

  const authLink = setContext(async (_, { headers }) => {
    const _headers = await getHeaders(headers);

    return {
      headers: _headers
    };
  });

  const httpLink = authLink.concat(link);

  // Create a WebSocket link:
  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      SUBSCRIPTION_ENDPOINT,
      {
        reconnect: true,
        timeout: 30000,
        connectionParams: async () => {
          return { headers: await getHeaders() };
        },
        connectionCallback: err => {
          if (err) {
            wsLink.subscriptionClient.close(false, false);
          }
        }
      },
      wsForNode
    )
  );

  // Chose the link to use based on operation
  const splitLink = split(
    // Split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache,
    link: splitLink,
    connectToDevTools: !_options.ssrMode,
    ssrMode: _options.ssrMode
  });

  return client;
};

module.exports = createApolloClient;
