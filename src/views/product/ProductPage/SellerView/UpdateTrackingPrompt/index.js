import { useState, useEffect } from 'react';
import { TextField, CircularProgress, Card } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTransaction, useQuery } from 'hooks';
import { defaultTxSteps } from 'store/constant';
import { createTracking } from 'api/tracking_server';
import Product from 'model/Product';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import { useTheme } from '@mui/material/styles';
import { useMoralis } from 'react-moralis';
import Button from 'ui-component/extended/Button';
import AddressDetail from 'views/Address/AddressDetail';

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

  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState({
    trackingId: '',
    trackingNo: '',
    slug: '',
  });

  const [buyerAddress, setBuyerAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: '',
    phoneNumber: '',
  });
  const [getAddressError, setGetAddressError] = useState();

  const { signAndSendTransaction, txState, ...txProps } = useTransaction(
    ['update shipping detail'].concat(defaultTxSteps),
    (_state) => {
      return _state.activeStep === 0 || _state.activeStep === 4;
    }
  );

  const { handleOpen, handleNextStep, handleError } = txProps;
  const { Moralis } = useMoralis();
  const { queryEqualTo } = useQuery();

  const getBuyerAddress = async () => {
    setGetAddressError(null);
    try {
      const transaction = await queryEqualTo({
        className: 'Transaction',
        attr: 'contractAddress',
        target: product.address,
        latest: true,
      });

      setBuyerAddress(transaction.attributes.address);
    } catch (err) {
      setGetAddressError(new Error('Cannot Get Buyer Address'));
    }
  };

  const getShipmentDetail = async () => {
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

      return res;
    } catch (err) {}
  };

  const addShipmentDetail = async ({ trackingNo, trackingId, slug }) => {
    const buyer = await Moralis.Cloud.run('getUserByEthAddress', {
      targetEthAddr: product.buyer,
    });
    return Moralis.Cloud.run('addShipmentDetail', {
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
    return trackingId;
  };

  const handleConfirmTracking = async (e) => {
    e.preventDefault();
    let trackingId;
    try {
      const res = await getShipmentDetail();

      if (!res) {
        setIsLoading(true);
        trackingId = await updateTracking();
      } else {
        trackingId = res.attributes.trackingId;
      }

      setIsLoading(false);
      handleNextStep();
      await signAndSendTransaction(() => {
        return onSendTransaction(product.address, trackingId);
      });
      await onUpdate(product.id);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getBuyerAddress();
  }, []);

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
              <div
                style={{
                  display: 'flex',
                  margin: '20px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      margin: '20px',
                      justifyContent: 'center',
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
                  sx={{ padding: 'none' }}
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

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '5px 5px 10px rgb(0 0 0 / 15%)',
          marginBottom: '1rem',
          padding: '1rem',
        }}
      >
        {getAddressError ? (
          <p style={{ color: theme.palette.error.main }}>
            {getAddressError.message}
          </p>
        ) : (
          <AddressDetail address={buyerAddress} />
        )}
      </Card>
      <form className={classes.trackingForm}>
        <Button
          style={{ marginTop: '4px' }}
          onClick={() => {
            setIsLoading(false);
            handleOpen();
            getShipmentDetail();
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
