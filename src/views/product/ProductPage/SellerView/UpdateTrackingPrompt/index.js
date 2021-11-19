import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTransaction } from "hooks";
import { defaultTxSteps } from "store/constant";
import { createTracking } from "api/tracking_server";
import Product from "model/Product";
import TransactionModal from "ui-component/extended/Modal/TransactionModal";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  trackingForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const UpdateTrackingPrompt = ({ product, onSendTransaction, onUpdate }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [trackingNo, setTrackingNo] = useState("");

  const { signAndSendTransaction, txState, ...txProps } = useTransaction(
    ["update shipping detail"].concat(defaultTxSteps)
  );

  const { handleOpen, handleNextStep, handleError } = txProps;
  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    handleOpen();
    try {
      const response = await createTracking(product.id, trackingNo.trim());
      const trackingId = response.data.tracking.id;
      handleNextStep();
      await signAndSendTransaction(() =>
        onSendTransaction(product.address, trackingId)
      );
      await onUpdate(product.id);
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <>
      <TransactionModal {...txState} {...txProps} />
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
          onClick={handleUpdateTracking}
        >
          Update
        </Button>
      </form>
    </>
  );
};

UpdateTrackingPrompt.propTypes = {
  product: Product,
};

export default UpdateTrackingPrompt;
