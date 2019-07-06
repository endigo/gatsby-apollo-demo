const React = require('react');
const {ApolloProvider} = require('react-apollo');
const {ApolloProvider: ApolloHooksProvider} = require('react-apollo-hooks');
const {renderToString} = require('react-dom/server');

const createApolloClient = require('./src/createApolloClient');

const client = createApolloClient();

exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString}) => {
  const ConnectedBody = () => (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{bodyComponent}</ApolloHooksProvider>
    </ApolloProvider>
  );

  replaceBodyHTMLString(renderToString(<ConnectedBody/>));
};
