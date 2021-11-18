// material-ui
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// project imports
import { useNavigate } from "react-router-dom";

// hooks
import { useEscrow, useTransaction } from "hooks";
import { useProduct } from "context";
import TransactionModal from "../../../../ui-component/extended/Modal/TransactionModal";

const BuyerView = ({ product }) => {
  const navigate = useNavigate();
  const { updateProductInfo } = useProduct();
  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    "Select Shipping Address",
    "Sign transaction",
    "Transaction initiated",
    "Confirmation",
  ]);
  const { handleNextStep, handleOpen } = txProps;
  const { order } = useEscrow();

  const handleClick = () => {
    handleOpen();
  };

  const handleEnterShippingAddress = async () => {
    // do sth with address
    handleNextStep();
    await handleBuy();
  };

  const handleBuy = async () => {
    await signAndSendTransaction(() => order(product.address, product.price));
    await updateProductInfo(product.id);
    // navigate to my purchase
    navigate("/user/account-profile", { state: { value: 1 } });
  };

  return (
    <>
      {product.isAbleToBuy && (
        <>
          <TransactionModal
            {...txState}
            {...txProps}
            components={{
              0: (
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  Enter Shipping Address
                  <Button onClick={handleEnterShippingAddress}>
                    {" "}
                    Continue{" "}
                  </Button>
                </Grid>
              ),
            }}
          />
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleClick}
            >
              Buy Now
            </Button>
          </Grid>
        </>
      )}
    </>
  );
};

export default BuyerView;
