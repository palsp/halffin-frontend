import { useEffect, useState } from "react";
// material-ui
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MuiTypography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { useNavigate, useParams } from "react-router-dom";
import ethIcon from "assets/images/icons/eth.svg";

// hooks
import { useEscrow } from "hooks";
import { useProduct } from "context";

const BuyerView = ({ product }) => {
  const navigate = useNavigate();
  const { updateProductInfo } = useProduct();
  const [isLoading, setLoading] = useState(true);
  const { order } = useEscrow();

  const handleBuy = async () => {
    await order(product.address, product.price);
    await updateProductInfo(product.id);
    // navigate to my purchase
    navigate("/user/account-profile", { state: { value: 1 } });
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {product.isAbleToBuy && (
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={handleBuy}
          >
            Buy Now
          </Button>
        </Grid>
      )}
    </>
  );
};

export default BuyerView;
