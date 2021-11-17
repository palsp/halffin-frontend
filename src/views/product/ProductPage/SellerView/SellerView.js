import { useEffect, useState } from "react";
// material-ui
import Grid from "@mui/material/Grid";
// project imports
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// hooks
import { useEscrow } from "hooks";
import { useTx } from "hooks";
import { makeStyles } from "@mui/styles";
import { createTracking } from "api/tracking_server";

const useStyles = makeStyles((theme) => ({
  trackingForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

// api

const SellerView = ({ onUpdate, product }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const { signAndSendTransaction } = useTx();
  const [isShipmentUpdating, setIsShipmentUpdating] = useState(false);
  const {
    updateShipment,
    requestShippingDetail,
    reclaimFund,
    listenOnShipmentDetail,
  } = useEscrow();
  const [trackingNo, setTrackingNo] = useState("");

  const updateTracking = async (e) => {
    e.preventDefault();
    try {
      const response = await createTracking(product.id, trackingNo.trim());
      const trackingId = response.data.tracking.id;
      await signAndSendTransaction(() =>
        updateShipment(product.address, trackingId)
      );
      await onUpdate(product.id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestShippingDetail = async () => {
    await signAndSendTransaction(() => requestShippingDetail(product.address));

    setIsShipmentUpdating(true);

    listenOnShipmentDetail(product.address, async (error, event) => {
      await onUpdate(product.id);
      setIsShipmentUpdating(false);
    });
  };

  const handleReclaimFund = async () => {
    await signAndSendTransaction(() => reclaimFund(product.address));
    await onUpdate(product.id);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
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
              onClick={(e) => updateTracking(e)}
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
