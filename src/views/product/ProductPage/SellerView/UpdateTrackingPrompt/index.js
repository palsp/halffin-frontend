import { useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTransaction, useQuery } from "hooks";
import { defaultTxSteps } from "store/constant";
import { createTracking } from "api/tracking_server";
import Product from "model/Product";
import TransactionModal from "ui-component/extended/Modal/TransactionModal";
import { useTheme } from "@mui/material/styles";
import { useMoralis } from "react-moralis";
import Button from "ui-component/extended/Button";

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

  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState({
    trackingId: "",
    trackingNo: "",
    slug: "",
  });

  const { signAndSendTransaction, txState, ...txProps } = useTransaction(
    ["update shipping detail"].concat(defaultTxSteps)
  );

  const { handleOpen, handleNextStep, handleError } = txProps;
  const { Moralis } = useMoralis();
  const { queryEqualTo } = useQuery();

  const getShipmentDetail = async () => {
    try {
      const res = await queryEqualTo({
        className: "Shipment",
        attr: "contractAddress",
        target: product.address,
      });
      if (res) {
        setShipment({
          trackingId: res.attributes.trackingId,
          trackingNo: res.attributes.trackingNo,
          slug: res.attributes.slug,
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const addShipmentDetail = async ({ trackingNo, trackingId, slug }) => {
    const buyer = await Moralis.Cloud.run("getUserByEthAddress", {
      targetEthAddr: product.buyer,
    });
    return Moralis.Cloud.run("addShipmentDetail", {
      trackingId,
      trackingNo,
      slug,
      contractAddress: product.address,
      buyerId: buyer.id,
    });
  };

  const updateTracking = async () => {
    const response = await createTracking(
      product.id,
      shipment.trackingNo.trim()
    );
    const trackingId = response.data.tracking.id;
    const slug = response.data.tracking.slug;

    await addShipmentDetail({
      trackingNo: shipment.trackingNo.trim(),
      trackingId,
      slug,
    });
  };

  const handleConfirmTracking = async (e) => {
    e.preventDefault();

    try {
      await getShipmentDetail();

      if (shipment.trackingId.length === 0 && shipment.trackingNo.length > 0) {
        setIsLoading(true);
        await updateTracking();
      }
      setIsLoading(false);
      handleNextStep();
      await signAndSendTransaction(() =>
        onSendTransaction(product.address, shipment.trackingId)
      );
      await onUpdate(product.id);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <TransactionModal
        {...txState}
        {...txProps}
        components={{
          0: (
            <div
              style={{
                display: "flex",
                margin: "20px",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  margin: "20px",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      margin: "20px",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : null}
                <TextField
                  fullWidth
                  required
                  label="Tracking Number"
                  margin="normal"
                  name="trackingNumber"
                  type="text"
                  defaultValue=""
                  disabled={shipment.trackingId.length > 0}
                  sx={{ ...theme.typography.customInput }}
                  value={shipment.trackingNo}
                  onChange={(e) =>
                    setShipment((prevState) => ({
                      ...prevState,
                      trackingNo: e.target.value,
                    }))
                  }
                />

                <Button
                  sx={{ padding: "none" }}
                  disabled={shipment.trackingNo.length <= 0}
                  size="small"
                  type="submit"
                  onClick={handleConfirmTracking}
                  label={<h4>Next</h4>}
                />
              </div>
            </div>
          ),
        }}
      />
      <form className={classes.trackingForm}>
        <Button
          onClick={() => {
            setIsLoading(false);
            handleOpen();
          }}
          label={<h4>Update Tracking</h4>}
        />
      </form>
    </>
  );
};

UpdateTrackingPrompt.propTypes = {
  product: Product,
};

export default UpdateTrackingPrompt;
