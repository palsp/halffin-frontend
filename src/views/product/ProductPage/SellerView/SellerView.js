import { useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
// project imports

// hooks
import { useEscrow, useTransaction, useQuery } from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import { defaultTxSteps } from 'store/constant';
import UpdateTrackingPrompt from './UpdateTrackingPrompt';
import BaseButton from 'ui-component/extended/BaseButton';
import { useMoralis } from 'react-moralis';
import AddressDetail from 'ui-component/Address/AddressDetail';

const SellerView = ({ onUpdate, product }) => {
  const { signAndSendTransaction, txState, ...txProps } = useTransaction(defaultTxSteps);

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
  const { requestShippingDetail, reclaimFund, listenOnShipmentDetail, updateShipment } =
    useEscrow();

  const { queryEqualTo } = useQuery();

  const { Moralis } = useMoralis();

  const getBuyerAddress = async () => {
    const buyer = await Moralis.Cloud.run('getUserByEthAddress', {
      targetEthAddr: product.buyer,
    });
    const res = await queryEqualTo({ className: 'Address', attr: 'userId', target: buyer.id });
    setBuyerAddress(res.attributes);
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
      <button onClick={getBuyerAddress}>Get Buyer Address</button>
      <AddressDetail address={buyerAddress} />
      <Grid item>
        {product.isWaitForShipping && (
          <UpdateTrackingPrompt
            product={product}
            onSendTransaction={updateShipment}
            onUpdate={onUpdate}
          />
        )}
        {isShipmentUpdating && <div>check inprogress. this may take a while</div>}
        {!isShipmentUpdating && product.isAbleToCheckTrackingStatus && (
          <BaseButton onClick={handleRequestShippingDetail}>Check Tracking Status</BaseButton>
        )}

        {product.isAbleToClaimFund && (
          <BaseButton onClick={handleReclaimFund}>Claim Fund</BaseButton>
        )}
      </Grid>
    </>
  );
};

export default SellerView;
