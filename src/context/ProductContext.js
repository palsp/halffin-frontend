import React, { useState, useEffect, useCallback } from 'react';
import { useEscrowFactory, useEscrow, useWeb3 } from 'hooks';
import { addressEqual } from '@usedapp/core';
import { useQuery } from '@apollo/client';
import { QUERY } from 'api/apollo';
import Product from '../model/Product';

const ProductContext = React.createContext({});

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { getProductDetail } = useEscrow();
  const { web3Utils } = useWeb3();
  const { data } = useQuery(QUERY);

  useEffect(() => {
    // skip if factoryContract is not initialized
    if (data) {
      const products = data.products
        .map((_product) => {
          const { id, productId, buyer, price, owner, ...args } = _product;
          const product = new Product({
            id: productId,
            buyer: buyer
              ? buyer.id
              : '0x0000000000000000000000000000000000000000',
            owner: owner.id,
            price: web3Utils.fromWei(price, 'ether'),
            ...args,
          });
          product.addAddress(id);
          return product;
        })
        .sort((a, b) => a.id - b.id);

      setProducts(products);
    }
  }, [data, web3Utils]);
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
