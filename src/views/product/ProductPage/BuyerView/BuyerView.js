import { useState, useEffect } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// project imports
import { useNavigate } from 'react-router-dom';

import FormModal from 'ui-component/Address/FormModal';
import AddressDetail from 'ui-component/Address/AddressDetail';
// hooks
import { useEscrow, useTransaction } from 'hooks';
import { useAddress, useProduct } from 'context';
import TransactionModal from '../../../../ui-component/extended/Modal/TransactionModal';
import { useMoralis } from 'react-moralis';

const BuyerView = ({ product }) => {
  const navigate = useNavigate();
  const { updateProductInfo } = useProduct();
  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    'Select Shipping Address',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);
  const { handleNextStep, handleOpen } = txProps;
  const { order } = useEscrow();
  const { Moralis, user } = useMoralis();

  const { address, getAddress, addAddress } = useAddress();

  // Form Modal
  const [modalOpen, setModalOpen] = useState(false);
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

    const res = await Moralis.Cloud.run('allowPermissionToUserId', {
      targetId: seller.id,
    });

    return res;
  };

  const handleClick = () => {
    handleOpen();
  };

  const handleEnterShippingAddress = async () => {
    // check if user really have shipping address
    const Address = Moralis.Object.extend('Address');
    const query = new Moralis.Query(Address);
    query.equalTo('userId', user.id);
    console.log(user.id);
    const address = await query.first();
    if (!address || address.attributes.firstName.length === 0) {
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
    await updateProductInfo(product.id);
    // navigate to my purchase
    navigate('/user/account-profile', { state: { value: 1 } });
  };

  useEffect(() => {
    getAddress();
  }, [modalOpen]);

  return (
    <>
      {product.isAbleToBuy && (
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
            <Button
              variant="contained"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={handleClick}
            >
              Buy Now
            </Button>
          </Grid>
        </>
      )}
    </>
  );
};

export default BuyerView;
