import { useState, useEffect } from 'react';
// material-ui
import {
  Tooltip,
  Grid,
  IconButton,
  useTheme,
  tooltipClasses,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
// project imports

// hooks
import { useEscrow, useQuery, useTransaction } from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import { defaultTxSteps } from 'store/constant';
import UpdateTrackingPrompt from './UpdateTrackingPrompt';
import Button from 'ui-component/extended/Button';
import { useMoralis } from 'react-moralis';
import { styled } from '@mui/material/styles';
import AddressDetail from 'ui-component/Address/AddressDetail';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const SellerView = ({ onUpdate, product }) => {
  const theme = useTheme();
  const { signAndSendTransaction, txState, ...txProps } =
    useTransaction(defaultTxSteps);

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
  const [isShipmentUpdating, setIsShipmentUpdating] = useState(false);
  const {
    requestShippingDetail,
    reclaimFund,
    listenOnShipmentDetail,
    updateShipment,
  } = useEscrow();

  const { queryEqualTo } = useQuery();

  useEffect(() => {
    getBuyerAddress();
  }, []);

  const getBuyerAddress = async () => {
    try {
      const transaction = await queryEqualTo({
        className: 'Transaction',
        attr: 'contractAddress',
        target: product.address,
        latest: true,
      });

      setBuyerAddress(transaction.attributes.address);
    } catch (err) {
      txProps.handleError(err);
    }
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
      <TransactionModal {...txState} {...txProps} />
      <Grid item>
        {product.isWaitForShipping && (
          <>
            <AddressDetail address={buyerAddress} />
            <UpdateTrackingPrompt
              product={product}
              onSendTransaction={updateShipment}
              onUpdate={onUpdate}
            />
          </>
        )}
        {isShipmentUpdating && (
          <div>check inprogress. this may take a while</div>
        )}
        {!isShipmentUpdating && product.isAbleToCheckTrackingStatus && (
          <Grid item direction="row">
            <Button
              onClick={handleRequestShippingDetail}
              label={<h4> Check Tracking Status</h4>}
            />
            <HtmlTooltip
              title={
                <>
                  <em>
                    {
                      'We have to ensure that the product is delivered before we can let you claim your fund.'
                    }
                  </em>{' '}
                  <br />
                  <br />
                  Note that there is no action in case your shipping is not
                  delivered yet. Please check status of your package with your
                  courier first before clicking this button. otherwise you may
                  lost some eth for gas fee.
                </>
              }
            >
              <IconButton>
                <InfoIcon sx={{ color: theme.palette.background.paper }} />
              </IconButton>
            </HtmlTooltip>
          </Grid>
        )}

        {product.isAbleToClaimFund && (
          <Button onClick={handleReclaimFund} label={<h4>Claim Fund</h4>} />
        )}
      </Grid>
    </>
  );
};

export default SellerView;
