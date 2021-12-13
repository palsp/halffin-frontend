import { gql } from '@apollo/client';

export const QUERY = gql`
  {
    products {
      id
      productId
      name
      price
      stage
      lockPeriod
      owner {
        id
      }
      buyer {
        id
      }
      trackingId
      productURI
      deliveryStatus
      stage
    }
    users {
      id
      myProducts {
        id
      }
      myPurchase {
        id
      }
    }
  }
`;
