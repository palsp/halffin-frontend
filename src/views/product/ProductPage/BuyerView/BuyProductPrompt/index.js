import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
// material-ui
import Grid from '@mui/material/Grid';
// project imports
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useAddress } from 'context';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import FormModal from 'views/Address/FormModal';
import AddressDetail from 'views/Address/AddressDetail';
import { Typography } from '@mui/material';
import Button from 'ui-component/extended/Button';
import { useTheme } from '@mui/material/styles';
// material-ui
import TabPanels from 'ui-component/extended/TabPanels';
// project imports
import { useEscrow, useTransaction, useQuery } from 'hooks';

const BuyProductPrompt = ({ product, onUpdate }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { Moralis, user } = useMoralis();
  const { signAndSendTransaction, txState, ...txProps } = useTransaction(
    [
      'Select Shipping Address',
      'Sign transaction',
      'Transaction initiated',
      'Confirmation',
    ],
    (_state) => {
      return _state.activeStep === 0 || _state.activeStep === 4;
    }
  );

  const { queryEqualTo } = useQuery();
  const { handleNextStep, handleOpen, handleError } = txProps;
  const { addresses, getAddress, addAddress, editAddress, deleteAddress } =
    useAddress();
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

  const getProductFromContract = async () => {
    const res = await Moralis.Cloud.run('getProductFromContract', {
      contractAddress: product.address,
    });
    console.log('resss x', res);
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
        style={{ width: '1000px', minHeight: '115px' }}
        components={{
          0: (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h2">
                Please Check your Shipping Address
              </Typography>

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
                          handleDeleteClose={() =>
                            handleDeleteClose(address.id)
                          }
                          addressId={address.id}
                          address={address.attributes}
                          modifyAddress={editAddress}
                          deleteAddress={deleteAddress}
                        />
                        <AddressDetail address={address.attributes} />
                      </div>
                    ),
                  };
                })}
              />
              <Button
                style={{
                  height: '4vh',
                  borderRadius: '5px',
                }}
                onClick={handleEnterShippingAddress}
                label={<h4>Continue</h4>}
              />
              {/* <Button onClick={getProductFromContract} label={<h4>Web3</h4>} /> */}
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
