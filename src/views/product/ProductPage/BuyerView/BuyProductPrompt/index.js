import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
// material-ui
import { Grid } from '@mui/material';
import TabPanels from 'ui-component/extended/TabPanels';
// project imports
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useAddress } from 'context';
import { useEscrow, useTransaction, useQuery } from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import FormModal from 'ui-component/Address/FormModal';
import AddressDetail from 'ui-component/Address/AddressDetail';
import Button from 'ui-component/extended/Button';
import { useTheme } from '@mui/material/styles';

const BuyProductPrompt = ({ product, onUpdate }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { Moralis } = useMoralis();
  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    'Select Shipping Address',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);

  const { queryEqualTo } = useQuery();
  const { handleNextStep, handleOpen, handleError } = txProps;
  const { addresses, getAddress, addAddress, editAddress, deleteAddress } = useAddress();
  const [addrIndex, setAddrIndex] = useState(0);

  const { order } = useEscrow();

  const [modalOpen, setModalOpen] = useState({});
  const handleModalOpen = (addressId) => {
    setModalOpen({ [addressId]: true });
  };
  const handleModalClose = (addressId) => {
    setModalOpen({ [addressId]: false });
  };

  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const handleOpenAddingNewAddress = () => {
    setAddingNewAddress(true);
  };
  const handleCloseAddingNewAddress = () => {
    setAddingNewAddress(false);
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState({});
  const handleDeleteOpen = (addressId) => {
    setDeleteModalOpen({ [addressId]: true });
  };
  const handleDeleteClose = (addressId) => {
    setDeleteModalOpen({ [addressId]: false });
  };

  const allowSellerAddressPermission = async () => {
    try {
      const {
        firstName,
        lastName,
        email,
        address1,
        address2,
        city,
        state,
        postalCode,
        countryCode,
        phoneNumber,
      } = addresses[addrIndex].attributes;
      console.log(product.address);
      const transaction = await Moralis.Cloud.run('generateTransaction', {
        contractAddress: product.address,
        // addressId: addresses[addrIndex].id,
        address: {
          firstName,
          lastName,
          email,
          address1,
          address2,
          city,
          state,
          postalCode,
          countryCode,
          phoneNumber,
        },
      });
      console.log('tx', transaction);

      const seller = await Moralis.Cloud.run('getUserByEthAddress', {
        targetEthAddr: product.owner,
      });

      const res = await Moralis.Cloud.run('allowPermissionToUserId', {
        targetUserId: seller.id,
        addressId: addresses[addrIndex].id,
        transactionId: transaction.id,
      });
      console.log('res', res);
      return res;
    } catch (err) {
      console.log('err', err.message);
    }
  };

  const handleEnterShippingAddress = async () => {
    // check if user really have shipping address
    try {
      if (addresses.length === 0) {
        handleOpenAddingNewAddress();
        return;
      }

      // const addr = await queryEqualTo({
      //   className: 'Address',
      //   attr: 'objectId',
      //   target: addresses[addrIndex].id,
      // });

      handleNextStep();
      await handleBuy();

      // Allow ACL to seller
      await allowSellerAddressPermission();
    } catch (err) {
      handleError(err);
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
  }, [modalOpen, deleteModalOpen, addingNewAddress]);

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

              {addingNewAddress && (
                <FormModal
                  open={addingNewAddress}
                  handleOpen={handleOpenAddingNewAddress}
                  handleClose={handleCloseAddingNewAddress}
                  address={{
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
                  }}
                  modifyAddress={addAddress}
                />
              )}

              <TabPanels
                value={addrIndex}
                onChange={(e, index) => setAddrIndex(index)}
                components={addresses.map((address, index) => {
                  return {
                    label: index + 1,
                    component: (
                      <div>
                        <FormModal
                          open={modalOpen[address.id]}
                          deleteOpen={deleteModalOpen[address.id]}
                          handleOpen={() => handleModalOpen(address.id)}
                          handleClose={() => handleModalClose(address.id)}
                          handleDeleteOpen={() => handleDeleteOpen(address.id)}
                          handleDeleteClose={() => handleDeleteClose(address.id)}
                          addressId={address.id}
                          address={address.attributes}
                          modifyAddress={editAddress}
                          deleteAddress={deleteAddress}
                        />
                        <h3>{index + 1} </h3>
                        <AddressDetail address={address.attributes} />
                      </div>
                    ),
                  };
                })}
              />
              <Button onClick={handleEnterShippingAddress} label={<h4>Continue</h4>} />
              <Button onClick={allowSellerAddressPermission} label={<h4>Test</h4>} />
            </Grid>
          ),
        }}
      />
      <Grid item>
        <Button
          sx={{
            '.MuiChip-icon': {
              color: theme.palette.text.base,
            },
          }}
          icon={<AccountBalanceWalletIcon />}
          variant="contained"
          onClick={handleOpen}
          label={<h4>Buy Now</h4>}
        />
      </Grid>
    </>
  );
};

export default BuyProductPrompt;
