import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTransaction, useQuery } from 'hooks';
import { defaultTxSteps } from 'store/constant';
import { createTracking } from 'api/tracking_server';
import Product from 'model/Product';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import { useTheme } from '@mui/material/styles';
import { useMoralis } from 'react-moralis';

const useStyles = makeStyles((theme) => ({
  trackingForm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const UpdateTrackingPrompt = ({ product, onSendTransaction, onUpdate }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [shipment, setShipment] = useState({
    trackingId: '',
    trackingNo: '',
    slug: '',
  });

  const { signAndSendTransaction, txState, ...txProps } = useTransaction(
    ['update shipping detail'].concat(defaultTxSteps)
  );

  const { handleOpen, handleNextStep, handleError } = txProps;
  const { Moralis } = useMoralis();
  const { queryEqualTo } = useQuery();

  useEffect(() => {
    getTrackingNo();
    console.log('product', product);
  }, []);

  const getTrackingNo = async () => {
    try {
      const res = await queryEqualTo({
        className: 'Shipment',
        attr: 'contractAddress',
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

  const addShipmentDetail = ({ trackingNo, trackingId, slug }) => {
    return Moralis.Cloud.run('addShipmentDetail', {
      trackingId,
      trackingNo,
      slug,
      contractAddress: product.address,
    });
  };

  const updateTracking = async () => {
    const response = await createTracking(product.id, shipment.trackingNo.trim());
    const trackingId = response.data.tracking.id;
    const slug = response.data.tracking.slug;

    await addShipmentDetail({ trackingNo: shipment.trackingNo.trim(), trackingId, slug });
  };

  const handleConfirmTracking = async (e) => {
    e.preventDefault();

    try {
      if (shipment.trackingId.length === 0 && shipment.trackingNo.length > 0) {
        await updateTracking();
      }

      handleNextStep();
      await signAndSendTransaction(() => onSendTransaction(product.address, shipment.trackingId));
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
                display: 'flex',
                margin: '20px',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', margin: '20px', justifyContent: 'center' }}>
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
                    setShipment((prevState) => ({ ...prevState, trackingNo: e.target.value }))
                  }
                />

                <Button
                  sx={{ padding: 'none' }}
                  size="small"
                  type="submit"
                  onClick={handleConfirmTracking}
                >
                  Next
                </Button>
              </div>
            </div>
          ),
        }}
      />
      <form className={classes.trackingForm}>
        <Button onClick={handleOpen}>Update Tracking</Button>
      </form>
    </>
  );
};

UpdateTrackingPrompt.propTypes = {
  product: Product,
};

export default UpdateTrackingPrompt;
