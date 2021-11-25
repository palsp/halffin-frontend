import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
// material-ui
import { Grid, Button } from '@mui/material';
import TabPanels from 'ui-component/extended/TabPanels';
// project imports
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useAddress } from 'context';
import { useEscrow, useTransaction } from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import FormModal from 'ui-component/Address/FormModal';
import AddressDetail from 'ui-component/Address/AddressDetail';
import Button from 'ui-component/extended/Button';
import { useTheme } from '@mui/material/styles';

const BuyProductPrompt = ({ product, onUpdate }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { Moralis, user } = useMoralis();
  const [modalOpen, setModalOpen] = useState(false);
  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    'Select Shipping Address',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);

  const { handleNextStep, handleOpen, handleError } = txProps;
  const { addresses, getAddress, editAddress } = useAddress();
  const [addrIndex, setAddrIndex] = useState(0);

  const { order } = useEscrow();

  const [modalOpen, setModalOpen] = useState({});
  const handleModalOpen = (addressId) => {
    setModalOpen({ [addressId]: true });
  };
  const handleModalClose = (addressId) => {
    setModalOpen({ [addressId]: false });
  };

  const allowSellerAddressPermission = async () => {
    const seller = await Moralis.Cloud.run('getUserByEthAddress', {
      targetEthAddr: product.owner,
    });

    const transaction = await Moralis.Cloud.run('generateTransaction', {
      contractAddress: product.address,
      addressId: addresses[addrIndex].id,
    });
    const res = await Moralis.Cloud.run('allowPermissionToUserId', {
      targetUserId: seller.id,
      addressId: addresses[addrIndex].id,
      transactionId: transaction.id,
    });

    return res;
  };

  const handleEnterShippingAddress = async () => {
    // check if user really have shipping address
    try {
      const addr = await queryEqualTo({
        className: 'Address',
        attr: 'objectId',
        target: addresses[addrIndex].id,
      });

      if (!addr) {
        setModalOpen(true);
        return;
      }
      if (addr.attributes.firstName.length === 0) {
        setModalOpen(true);
        return;
      }

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
                          handleOpen={() => handleModalOpen(address.id)}
                          handleClose={() => handleModalClose(address.id)}
                          addressId={address.id}
                          address={address.attributes}
                          modifyAddress={editAddress}
                        />
                        <h3>{index + 1} </h3>
                        <AddressDetail address={address.attributes} />
                      </div>
                    ),
                  };
                })}
              />
              {<AddressDetail address={address} />}
              <Button onClick={handleEnterShippingAddress} label={<h4>Continue</h4>} />
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
