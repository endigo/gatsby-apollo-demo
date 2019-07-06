const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      query {
        hasura {
          products {
            id
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        return reject(result.errors);
      }
      const { products } = result.data.hasura;

      // Create product pages
      products.forEach(product => {
        createPage({
          path: `/product/${product.id}`,
          component: path.resolve(`src/templates/product.tsx`),
          context: {
            id: product.id
          }
        });
      });

      resolve();
    });
  });
};
