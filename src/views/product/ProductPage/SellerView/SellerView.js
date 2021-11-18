import { useEffect, useState } from "react";
// material-ui
import Grid from "@mui/material/Grid";
// project imports
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// hooks
import { useEscrow, useTransaction } from "hooks";
import { makeStyles } from "@mui/styles";
import { createTracking } from "api/tracking_server";
import TransactionModal from "ui-component/extended/Modal/TransactionModal";
import { defaultTxSteps } from "store/constant";

const useStyles = makeStyles((theme) => ({
  trackingForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

// api

const SellerView = ({ onUpdate, product }) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    signAndSendTransaction: signAndSendUpdateShippingTx,
    txState: updateShippingTxState,
    ...updateShippingTxProps
  } = useTransaction(["update shipping detail"].concat(defaultTxSteps));

  const { signAndSendTransaction, txState, ...txProps } =
    useTransaction(defaultTxSteps);

  const [isShipmentUpdating, setIsShipmentUpdating] = useState(false);
  const {
    updateShipment,
    requestShippingDetail,
    reclaimFund,
    listenOnShipmentDetail,
  } = useEscrow();
  const [trackingNo, setTrackingNo] = useState("");

  const handleTracking = async (e) => {
    e.preventDefault();
    updateShippingTxProps.handleOpen();
    try {
      const response = await createTracking(product.id, trackingNo.trim());
      const trackingId = response.data.tracking.id;
      updateShippingTxProps.handleNextStep();
      updateTracking(trackingId);
    } catch (err) {
      updateShippingTxProps.handleError(err);
    }
  };

  const updateTracking = async (trackingId) => {
    await signAndSendUpdateShippingTx(() =>
      updateShipment(product.address, trackingId)
    );
    await onUpdate(product.id);
  };

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
      <TransactionModal {...updateShippingTxState} {...updateShippingTxProps} />
      <TransactionModal {...txState} {...txProps} />
      <Grid item>
        {product.isWaitForShipping && (
          <form className={classes.trackingForm}>
            <TextField
              fullWidth
              required
              label="Tracking Number"
              margin="normal"
              name="trackingNumber"
              type="text"
              defaultValue=""
              sx={{ ...theme.typography.customInput }}
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
            />
            <Button
              sx={{ padding: "none" }}
              disabled={trackingNo.trim() === ""}
              size="small"
              type="submit"
              onClick={handleTracking}
            >
              Update
            </Button>
          </form>
        )}
        {isShipmentUpdating && (
          <div>check inprogress. this may take a while</div>
        )}
        {!isShipmentUpdating && product.isAbleToCheckTrackingStatus && (
          <Button
            size="small"
            type="button"
            size="large"
            variant="contained"
            color="primary"
            onClick={handleRequestShippingDetail}
          >
            Check Tracking Status
          </Button>
        )}
        {product.isAbleToClaimFund && (
          <Button
            size="small"
            type="button"
            size="large"
            variant="contained"
            color="primary"
            onClick={handleReclaimFund}
          >
            Claim Fund
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SellerView;
