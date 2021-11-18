// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// project imports
import { useNavigate } from 'react-router-dom';

// hooks
import { useEscrow, useTransaction } from 'hooks';
import { useProduct } from 'context';
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
  const { Moralis } = useMoralis();

  const allowPermission = async () => {
    const seller = await Moralis.Cloud.run('getUserByEthAddress', {
      targetEthAddr: product.owner,
    });

    const res = await Moralis.Cloud.run('allowPermissionToUserId', {
      targetId: seller.id,
    });

    console.log('allow permission', res);
  };

  const handleClick = () => {
    handleOpen();
  };

  const handleEnterShippingAddress = async () => {
    // do sth with address

    // check if user have address
    /// add address first

    handleNextStep();
    await handleBuy();

    // Send ACL to seller
  };

  const handleBuy = async () => {
    await signAndSendTransaction(() => order(product.address, product.price));
    await updateProductInfo(product.id);
    // navigate to my purchase
    navigate('/user/account-profile', { state: { value: 1 } });
  };

  return (
    <>
      <button onClick={allowPermission}>test allow</button>

      {product.isAbleToBuy && (
        <>
          <TransactionModal
            {...txState}
            {...txProps}
            components={{
              0: (
                <Grid container direction="column" justifyContent="center" alignItems="center">
                  Enter Shipping Address
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
