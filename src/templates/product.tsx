import * as React from "react";
import gql from "graphql-tag";
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
      reviews {
        id
        comment
        created_at
      }
    }
  }
`;

const ProductPage = (props: ProductProps) => {
  const { product } = props.data.hasura;
  const { data } = useSubscription(PRODUCT_QUERY, {
    variables: {
      id: props.pageContext.id
    }
  });

  return (
    <>
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
    </>
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
