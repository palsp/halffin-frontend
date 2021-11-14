import { useEffect, useState } from "react";
// material-ui
import { IconButton } from "@mui/material";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { IconCirclePlus } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useProduct } from "context";
import Products from "./Products";

const MarketPlace = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNavigate = (route = "") => {
    console.log("route", route);
    navigate(route);
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  const { products } = useProduct();
  return (
    <MainCard
      title="Market"
      secondary={
        <IconButton onClick={() => handleNavigate("/my-product/create")}>
          <IconCirclePlus />
        </IconButton>
      }
    >
      <Products isLoading={isLoading} products={products} />
    </MainCard>
  );
};

export default MarketPlace;
