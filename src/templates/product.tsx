import * as React from "react";
import gql from "graphql-tag";
import { Container } from "semantic-ui-react";
import { useSubscription } from "react-apollo-hooks";
import { graphql } from "gatsby";

interface ProductProps {
  data: {
    hasura: {
      product: any;
    };
  };
  pageContext: {
    id: number;
  };
}

const PRODUCT_QUERY = gql`
  subscription ProductSubscription($id: Int!) {
    product: products_by_pk(id: $id) {
      id
      name
      description
      price
      reivews {
        id
        comment
      }
    }
  }
`;

const ProductPage = (props: ProductProps) => {
  const { product } = props.data.hasura;
  const { data } = useSubscription(PRODUCT_QUERY, {
    variables: {
      id: props.pageContext.id,
    },
  });

  return (
    <Container>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h5>{product.price}</h5>

      {data && data.product && (
        <ul>
          {data.product.reviews.map((review: any) => (
            <li>{review.comment}</li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default ProductPage;

export const pageQuery = graphql`
  query TemplateProduct($id: Int!) {
    hasura {
      product: products_by_pk(id: $id) {
        id
        name
        description
        price
      }
    }
  }
`;
