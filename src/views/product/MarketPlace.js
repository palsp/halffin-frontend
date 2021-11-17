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

const MarketPlace = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNavigate = (route = "") => {
    navigate(route);
  };
  const { products } = useProduct();
  products.forEach((product) => console.log(product.name, product._stage));
  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, [products]);
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
        <ProductList
          isLoading={isLoading}
          products={products.filter((product) => product.isAbleToBuy)}
        />
      )}
    </MainCard>
  );
};

export default MarketPlace;
