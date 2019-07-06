const path = require('path');

// Create slugs for files.
// Slug will used for blog page path.
// exports.onCreateNode = ({ node, actions, getNode }) => {
//   const { createNodeField } = actions;
//   let slug;
//   switch (node.internal.type) {
//     case `MarkdownRemark`:
//       const fileNode = getNode(node.parent);
//       const [basePath, name] = fileNode.relativePath.split("/");
//       slug = `/${basePath}/${name}/`;
//       break;
//   }
//   if (slug) {
//     createNodeField({ node, name: `slug`, value: slug });
//   }
// };

// Implement the Gatsby API `createPages`.
// This is called after the Gatsby bootstrap is finished
// so you have access to any information necessary to
// programatically create pages.
exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;

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
      const {products} = result.data.hasura;

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
