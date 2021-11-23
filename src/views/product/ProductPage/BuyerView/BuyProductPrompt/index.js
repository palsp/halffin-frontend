import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// project imports
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useAddress } from 'context';
import { useEscrow, useTransaction } from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import FormModal from 'ui-component/Address/FormModal';
import AddressDetail from 'ui-component/Address/AddressDetail';

const BuyProductPrompt = ({ product, onUpdate }) => {
  const navigate = useNavigate();
  const { Moralis, user } = useMoralis();
  const [modalOpen, setModalOpen] = useState(false);
  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    'Select Shipping Address',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);

  const { handleNextStep, handleOpen } = txProps;
  const { address, getAddress, addAddress } = useAddress();
  const { order } = useEscrow();

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const allowPermission = async () => {
    const seller = await Moralis.Cloud.run('getUserByEthAddress', {
      targetEthAddr: product.owner,
    });

    return Moralis.Cloud.run('allowPermissionToUserId', {
      targetId: seller.id,
    });
  };

  const handleEnterShippingAddress = async () => {
    // check if user really have shipping address
    const Address = Moralis.Object.extend('Address');
    const query = new Moralis.Query(Address);
    query.equalTo('userId', user.id);
    const addr = await query.first();
    if (!addr || addr.attributes.firstName.length === 0) {
      setModalOpen(true);
      return;
    }

    handleNextStep();
    await handleBuy();

    // Send ACL to seller
    const res = await allowPermission();

    if (!res.success) {
      throw new Error('Something went wrong..');
    }
  };

  const handleBuy = async () => {
    await signAndSendTransaction(() => order(product.address, product.price));
    await onUpdate(product.id);
    // navigate to my purchase
    navigate('/user/account-profile', { state: { value: 1 } });
  };

  useEffect(() => {
    getAddress();
  }, [modalOpen]);

  return (
    <>
      <TransactionModal
        {...txState}
        {...txProps}
        style={{ width: '1000px', height: '150px' }}
        components={{
          0: (
            <Grid container direction="column" justifyContent="center" alignItems="center">
              <h1> Please Check your Shipping Address</h1>
              <FormModal
                open={modalOpen}
                handleOpen={handleModalOpen}
                handleClose={handleModalClose}
                address={address}
                addAddress={addAddress}
              />
              {<AddressDetail address={address} />}
              <Button onClick={handleEnterShippingAddress}> Continue </Button>
            </Grid>
          ),
        }}
      />
      <Grid item>
        <Button variant="contained" startIcon={<AccountBalanceWalletIcon />} onClick={handleOpen}>
          Buy Now
        </Button>
      </Grid>
    </>
  );
};

export default BuyProductPrompt;
