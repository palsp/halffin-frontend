import React, { useState, useEffect } from "react";
import { useEscrowFactory, useEscrow } from "hooks";

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
            return [
              ...prevState,
              { ...productDetail, address: productAddress },
            ];
          });
        }
      }
    );
  }, [factoryContract]);

  return (
    <ProductContext.Provider
      value={{
        products,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProduct = () => React.useContext(ProductContext);

export { useProduct, ProductProvider };
