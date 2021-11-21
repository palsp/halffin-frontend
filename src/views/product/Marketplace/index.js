import { useEffect, useState } from "react";
// material-ui
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { IconCirclePlus } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useProduct } from "context";
import ProductList from "../ProductList/ProductList";
import ProductSkeleton from "views/Skeleton/ProductSkeleton";
import { useMoralis } from "react-moralis";
import { addressEqual } from "@usedapp/core";
import { useTheme } from "@mui/material/styles";

const MarketPlace = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNavigate = (route = "") => {
    navigate(route);
  };
  const { products } = useProduct([]);
  const { user } = useMoralis();

  useEffect(() => {
    if (products.length !== 0) {
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
      darkTitle = "false"
      title="Market"
      secondary={
        <IconButton onClick={() => handleNavigate("/my-product/create")}>
          <IconCirclePlus style={{color: theme.palette.text.base}} />
        </IconButton>
      }
    >
      {isLoading ? (
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={4}
        >
          {[...Array(6)].map((_) => {
            return (
              <Grid item>
                <ProductSkeleton />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <ProductList isLoading={products === 0} products={displayProducts} />
      )}
    </MainCard>
  );
};

export default MarketPlace;
