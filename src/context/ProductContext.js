import React, { useState, useEffect, useCallback } from "react";
import { useEscrowFactory, useEscrow } from "hooks";
import { addressEqual } from "@usedapp/core";

const ProductContext = React.createContext({});

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { factoryContract } = useEscrowFactory();
  const { getProductDetail } = useEscrow();

  useEffect(() => {
    // skip if factoryContract is not initialized
    if (!factoryContract) return;

    factoryContract.events.ProductCreated(
      { fromBlock: 0 },
      async (error, event) => {
        if (!error) {
          const {
            returnValues: { product: productAddress },
          } = event;
          const productDetail = await getProductDetail(productAddress);
          productDetail.addAddress(productAddress);
          setProducts((prevState) => {
            return [...prevState, productDetail];
          });
        }
      }
    );
  }, [factoryContract]);
  const getProductsOfSeller = useCallback(
    (address) => {
      return products.filter((product) => addressEqual(address, product.owner));
    },
    [products]
  );

  const getProductsOfBuyer = useCallback(
    (address) => {
      return products.filter((product) => addressEqual(address, product.buyer));
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        getProductsOfBuyer,
        getProductsOfSeller,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProduct = () => React.useContext(ProductContext);

export { useProduct, ProductProvider };
