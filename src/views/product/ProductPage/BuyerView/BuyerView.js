import { useState, useEffect } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
// project imports
import { useQuery } from 'hooks';

// hooks
import { useEscrow, useTransaction } from 'hooks';
import TransactionModal from '../../../../ui-component/extended/Modal/TransactionModal';
import BuyProductPrompt from './BuyProductPrompt';
import { defaultTxSteps } from '../../../../store/constant';
import Detail from 'views/Address/Detail/Detail';
import Button from 'ui-component/extended/Button';
import { Card } from '@mui/material';

const BuyerView = ({ product, onUpdate, isDeliveredFail }) => {
  const { signAndSendTransaction, txState, ...txProps } =
    useTransaction(defaultTxSteps);
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
          <Button
            variant="contained"
            onClick={handleReclaimBuyer}
            label={<h4> Reclaim Fund</h4>}
          />
        </Grid>
      )}
      {product.isAbleToBuy && (
        <BuyProductPrompt product={product} onUpdate={onUpdate} />
      )}
      {product.isWaitForShipping && isAbleToCancel && !isDeliveredFail && (
        <Grid item>
          <Button
            variant="contained"
            onClick={handleCancelOrder}
            label={<h4>Cancel Order</h4>}
          />
        </Grid>
      )}

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '5px 5px 10px rgb(0 0 0 / 15%)',
          marginBottom: '1rem',
          padding: '1rem',
        }}
      >
        <div>
          {shipment.trackingNo.length > 0 &&
            Object.keys(shipment).map((key) => {
              if (key !== 'trackingId') {
                return (
                  <Detail
                    title={`${key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, function (str) {
                        return str.toUpperCase();
                      })}
                      :
                      `}
                    description={shipment[key]}
                  />
                );
              }
            })}
        </div>
      </Card>
    </>
  );
};

export default BuyerView;
