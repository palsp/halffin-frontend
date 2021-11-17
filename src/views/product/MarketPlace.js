import { useEffect, useState } from "react";
// material-ui
import { IconButton } from "@mui/material";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { IconCirclePlus } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useProduct } from "context";
import ProductList from "./ProductList/ProductList";
import ProductSkeleton from "views/Skeleton/ProductSkeleton";
import { useMoralis } from "react-moralis";
import { addressEqual } from "@usedapp/core";

const MarketPlace = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNavigate = (route = "") => {
    navigate(route);
  };
  const { products } = useProduct([]);
  const { user } = useMoralis();

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);

  let displayProducts = products.filter((product) => product.isAbleToBuy);
  if (user) {
    displayProducts = displayProducts.filter(
      (product) => !addressEqual(product.owner, user.attributes.ethAddress)
    );
  }

  return (
    <MainCard
      title="Market"
      secondary={
        <IconButton onClick={() => handleNavigate("/my-product/create")}>
          <IconCirclePlus />
        </IconButton>
      }
    >
      {isLoading && products ? (
        <ProductSkeleton />
      ) : (
        <ProductList isLoading={isLoading} products={displayProducts} />
      )}
    </MainCard>
  );
};

export default MarketPlace;
