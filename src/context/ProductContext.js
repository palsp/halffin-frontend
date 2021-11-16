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

  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  const getProductsOfBuyer = useCallback(
    (address) => {
      return products.filter((product) => addressEqual(address, product.buyer));
    },
    [products]
  );

  const updateProductInfo = async (id) => {
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex < 0) return null;
    const productDetail = products[productIndex];
    const newProductDetail = await getProductDetail(productDetail.address);
    setProducts((prevState) => {
      const temp = [...prevState];
      temp[productIndex] = newProductDetail;
      return temp;
    });
    return newProductDetail;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProductsOfBuyer,
        getProductsOfSeller,
        getProductById,
        updateProductInfo,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProduct = () => React.useContext(ProductContext);

export { useProduct, ProductProvider };
