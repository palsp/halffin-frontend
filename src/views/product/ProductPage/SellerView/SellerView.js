import { useEffect, useState } from "react";
// material-ui
import Grid from "@mui/material/Grid";
// project imports
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// hooks
import { useEscrow } from "hooks";
import { useProduct } from "context";
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
  const [isShipmentUpdating, setIsShipmentUpdating] = useState(false);
  const { updateShipment, requestShippingDetail, reclaimFund } = useEscrow();
  const [trackingNo, setTrackingNo] = useState("");

  const updateTracking = async (e) => {
    e.preventDefault();
    try {
      const response = await createTracking(product.id, trackingNo.trim());
      const trackingId = response.data.tracking.id;
      await updateShipment(product.address, trackingId);
      await onUpdate(product.id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestShippingDetail = async () => {
    await requestShippingDetail(
      product.address,
      () => {
        setIsShipmentUpdating(true);
      },
      async (error, event) => {
        console.log("handleRequestShippingDetail", event);
        await onUpdate(product.id);
        setIsShipmentUpdating(false);
      }
    );
  };

  const handleReclaimFund = async () => {
    await reclaimFund(product.address);
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
