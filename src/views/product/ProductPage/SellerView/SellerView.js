import { useState } from "react";
// material-ui
import Grid from "@mui/material/Grid";
// project imports

// hooks
import { useEscrow, useTransaction } from "hooks";
import TransactionModal from "ui-component/extended/Modal/TransactionModal";
import { defaultTxSteps } from "store/constant";
import UpdateTrackingPrompt from "./UpdateTrackingPrompt";
import BaseButton from "ui-component/extended/BaseButton";

const SellerView = ({ onUpdate, product }) => {
  const { signAndSendTransaction, txState, ...txProps } =
    useTransaction(defaultTxSteps);

  const [isShipmentUpdating, setIsShipmentUpdating] = useState(false);
  const {
    requestShippingDetail,
    reclaimFund,
    listenOnShipmentDetail,
    updateShipment,
  } = useEscrow();

  const handleRequestShippingDetail = async () => {
    txProps.handleOpen();
    await signAndSendTransaction(() => requestShippingDetail(product.address));

    setIsShipmentUpdating(true);

    listenOnShipmentDetail(product.address, async (error, event) => {
      await onUpdate(product.id);
      setIsShipmentUpdating(false);
    });
  };

  const handleReclaimFund = async () => {
    txProps.handleOpen();
    await signAndSendTransaction(() => reclaimFund(product.address));
    await onUpdate(product.id);
  };
  return (
    <>
      <TransactionModal {...txState} {...txProps} />
      <Grid item>
        {product.isWaitForShipping && (
          <UpdateTrackingPrompt
            product={product}
            onSendTransaction={updateShipment}
            onUpdate={onUpdate}
          />
        )}
        {isShipmentUpdating && (
          <div>check inprogress. this may take a while</div>
        )}
        {!isShipmentUpdating && product.isAbleToCheckTrackingStatus && (
          <BaseButton onClick={handleRequestShippingDetail}>
            Check Tracking Status
          </BaseButton>
        )}

        {product.isAbleToClaimFund && (
          <BaseButton onClick={handleReclaimFund}>Claim Fund</BaseButton>
        )}
      </Grid>
    </>
  );
};

export default SellerView;
