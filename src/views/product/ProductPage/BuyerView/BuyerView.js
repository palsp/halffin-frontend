// material-ui
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// project imports
import { useNavigate } from "react-router-dom";

// hooks
import { useEscrow, useTx } from "hooks";
import { useProduct } from "context";

const BuyerView = ({ product }) => {
  const navigate = useNavigate();
  const { updateProductInfo } = useProduct();
  const { signAndSendTransaction } = useTx();
  const { order } = useEscrow();

  const handleBuy = async () => {
    await signAndSendTransaction(() => order(product.address, product.price));
    await updateProductInfo(product.id);
    // navigate to my purchase
    navigate("/user/account-profile", { state: { value: 1 } });
  };

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
