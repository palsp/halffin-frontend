import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMoralis} from 'react-moralis';
// material-ui
import Grid from '@mui/material/Grid';
// project imports
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import {useAddress} from 'context';
import {useEscrow, useTransaction} from 'hooks';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import FormModal from 'ui-component/Address/FormModal';
import AddressDetail from 'ui-component/Address/AddressDetail';
import {Typography} from '@mui/material';
import Button from 'ui-component/extended/Button';
import {useTheme} from '@mui/material/styles';

const BuyProductPrompt = ({product, onUpdate}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {Moralis, user} = useMoralis();
  const [modalOpen, setModalOpen] = useState(false);
  const {signAndSendTransaction, txState, ...txProps} = useTransaction(
    [
      'Select Shipping Address',
      'Sign transaction',
      'Transaction initiated',
      'Confirmation',
    ],
    _state => {
      return _state.activeStep === 0 || _state.activeStep === 4;
    }
  );

  const {handleNextStep, handleOpen} = txProps;
  const {address, getAddress, addAddress} = useAddress();
  const {order} = useEscrow();

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
    navigate('/user/account-profile', {state: {value: 1}});
  };

  useEffect(() => {
    getAddress();
  }, [modalOpen]);

  return (
    <>
      <TransactionModal
        {...txState}
        {...txProps}
        style={{
          width: '1000px',
          height: '150px',
        }}
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
              <FormModal
                open={modalOpen}
                handleOpen={handleModalOpen}
                handleClose={handleModalClose}
                address={address}
                addAddress={addAddress}
              />
              {<AddressDetail address={address} />}
              <Button
                onClick={handleEnterShippingAddress}
                label={<h4>Continue</h4>}
              />
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
