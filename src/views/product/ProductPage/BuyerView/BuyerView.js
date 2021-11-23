import { useState, useEffect } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// project imports
import { useQuery } from 'hooks';

// hooks
import { useEscrow, useTransaction } from 'hooks';
import TransactionModal from '../../../../ui-component/extended/Modal/TransactionModal';
import BuyProductPrompt from './BuyProductPrompt';
import { defaultTxSteps } from '../../../../store/constant';
import Detail from 'ui-component/Address/Detail/Detail';

const BuyerView = ({ product, onUpdate, isDeliveredFail }) => {
  const { signAndSendTransaction, txState, ...txProps } = useTransaction(defaultTxSteps);
  const { checkForCancelOrder, cancelOrder, reclaimBuyer } = useEscrow();
  const [isAbleToCancel, setIsAbleToCancel] = useState(false);

  const { handleError } = txProps;

  const [shipment, setShipment] = useState({
    trackingId: '',
    trackingNo: '',
    slug: '',
  });

  const { queryEqualTo } = useQuery();

  useEffect(() => {
    fetch();
    getShipmentDetail();
  }, []);

  const fetch = async () => {
    try {
      const res = await checkForCancelOrder(product.address);
      setIsAbleToCancel(res);
    } catch (err) {
      handleError(err);
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
    } catch (err) {
      handleError(err);
    }
  };

  const handleReclaimBuyer = async () => {
    txProps.handleOpen();
    await signAndSendTransaction(() => reclaimBuyer(product.address));
    await onUpdate(product.id);
  };
  const handleCancelOrder = async () => {
    txProps.handleOpen();
    await signAndSendTransaction(() => cancelOrder(product.address));
    await onUpdate(product.id);
  };

  return (
    <>
      <TransactionModal {...txState} {...txProps} />
      {isDeliveredFail && (
        <Grid item>
          <Button variant="contained" onClick={handleReclaimBuyer}>
            Reclaim Fund
          </Button>
        </Grid>
      )}
      {product.isAbleToBuy && <BuyProductPrompt product={product} onUpdate={onUpdate} />}
      {product.isWaitForShipping && isAbleToCancel && !isDeliveredFail && (
        <Grid item>
          <Button variant="contained" onClick={handleCancelOrder}>
            Cancel Order
          </Button>
        </Grid>
      )}

      <div>
        {shipment.trackingNo.length > 0 &&
          Object.keys(shipment).map((key) => {
            if (key !== 'trackingId') {
              return <Detail title={key} description={shipment[key]} />;
            }
          })}
      </div>
    </>
  );
};

export default BuyerView;
