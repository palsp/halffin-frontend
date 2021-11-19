import { useState, useEffect } from "react";
// material-ui
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// project imports
import { useNavigate } from "react-router-dom";

// hooks
import { useEscrow, useTransaction } from "hooks";
import TransactionModal from "../../../../ui-component/extended/Modal/TransactionModal";
import BuyProductPrompt from "./BuyProductPrompt";
import { defaultTxSteps } from "../../../../store/constant";

const BuyerView = ({ product, onUpdate }) => {
  const { signAndSendTransaction, txState, ...txProps } =
    useTransaction(defaultTxSteps);
  const { checkForCancelOrder, cancelOrder } = useEscrow();
  const [isAbleToCancel, setIsAbleToCancel] = useState(false);

  const handleCancelOrder = async () => {
    txProps.handleOpen();
    await signAndSendTransaction(() => cancelOrder(product.address));
    await onUpdate(product.id);
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await checkForCancelOrder(product.address);
      setIsAbleToCancel(res);
    };
    fetch();
  }, []);

  return (
    <>
      <TransactionModal {...txState} {...txProps} />
      {product.isAbleToBuy && (
        <BuyProductPrompt product={product} onUpdate={onUpdate} />
      )}
      {product.isWaitForShipping && isAbleToCancel && (
        <Grid item>
          <Button variant="contained" onClick={handleCancelOrder}>
            Cancel Order
          </Button>
        </Grid>
      )}
    </>
  );
};

export default BuyerView;
