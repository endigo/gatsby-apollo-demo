import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Link from "gatsby-link";

const IndexPage = (props: any) => {
  const data = useStaticQuery(query);

  return (
    <>
      {data && data.hasura && data.hasura.products && (
        <ul>
          {data.hasura.products.map((product: any) => (
            <li>
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query ProductList {
    hasura {
      products {
        id
        name
      }
    }
  }
`;
