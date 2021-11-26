import { useState, useEffect } from 'react';

// material-ui
import Button from 'ui-component/extended/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { useMoralis } from 'react-moralis';
import MuiTypography from '@mui/material/Typography';
import { useAddress, useProduct } from 'context';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import ProductList from '../product/ProductList/ProductList';
import { shortenIfAddress } from '@usedapp/core';
import TabPanels from 'ui-component/extended/TabPanels';
import { useTheme } from '@mui/material/styles';
import AddressDetail from 'views/Address/AddressDetail';
import FormModal from 'views/Address/FormModal';

const MY_PRODUCT_LABELS = [
  'In Market',
  'Waiting For Shipment',
  'To Be Delivered',
  'To Be Claimed',
  'Complete',
];

const MY_PURCHASE_LABELS = [
  'Waiting For Shipment',
  'To Be Delivered',
  'Complete',
];

const UserProfile = () => {
  const theme = useTheme();
  const [open, setOpen] = useState({});
  const handleOpen = (addressId) => {
    setOpen({ [addressId]: true });
  };
  const handleClose = (addressId) => {
    setOpen({ [addressId]: false });
  };

  const [deleteOpen, setDeleteOpen] = useState({});
  const handleDeleteOpen = (addressId) => {
    setDeleteOpen({ [addressId]: true });
  };
  const handleDeleteClose = (addressId) => {
    setDeleteOpen({ [addressId]: false });
  };

  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const handleOpenAddingNewAddress = () => {
    setAddingNewAddress(true);
  };
  const handleCloseAddingNewAddress = () => {
    setAddingNewAddress(false);
  };
  const {
    addresses,
    setAddress,
    getAddress,
    addAddress,
    editAddress,
    deleteAddress,
  } = useAddress();

  const [value, setValue] = useState(0);
  const [myPurchaseValue, setMyPurchaseValue] = useState(0);
  const [myProductValue, setMyProductValue] = useState(0);

  const { user } = useMoralis();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      state.value && state.value < 3 && setValue(state.value);
      state.myPurchaseValue &&
        state.myPurchaseValue < 3 &&
        setMyPurchaseValue(state.myPurchaseValue);

      state.myProductValue &&
        state.myProductValue < 4 &&
        setMyProductValue(state.myProductValue);
    }
  }, [state]);

  const { getProductsOfSeller, getProductsOfBuyer } = useProduct();
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    getAddress();
  }, [user, open, deleteOpen, addingNewAddress]);

  let myProductComponents = [];
  let myPurchaseComponents = [];

  if (user) {
    const productsOfSeller = getProductsOfSeller(user.attributes.ethAddress);
    const productsOfBuyers = getProductsOfBuyer(user.attributes.ethAddress);
    const myProduct = [[], [], [], [], []];
    const myPurchase = [[], [], []];

    // myProduct
    productsOfSeller.forEach((product) => {
      myProduct[parseInt(product._stage)].push(product);
    });

    myProductComponents = MY_PRODUCT_LABELS.map((label, index) => ({
      label: `${label} (${myProduct[index].length})`,
      component: <ProductList products={[...myProduct[index]]} />,
    }));

    // myPurchase
    productsOfBuyers.forEach((product) => {
      if (product.isWaitForShipping) {
        myPurchase[0].push(product);
      } else if (product.isAbleToCheckTrackingStatus) {
        myPurchase[1].push(product);
      } else if (product.isAbleToClaimFund || product.isEnd) {
        myPurchase[2].push(product);
      }
    });

    myPurchaseComponents = MY_PURCHASE_LABELS.map((label, index) => ({
      label: `${label} (${myPurchase[index].length})`,
      component: <ProductList products={myPurchase[index]} />,
    }));
  }

  return (
    <>
      {!user ? (
        <Navigate to="/" />
      ) : (
        <MainCard style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src="https://picsum.photos/200"
              sx={{ width: 100, height: 100, marginTop: '16px' }}
            />
            <MuiTypography
              variant="subtitle1"
              gutterBottom
              style={{ color: theme.palette.text.base, marginTop: '16px' }}
            >
              {shortenIfAddress(user.attributes.ethAddress)}
            </MuiTypography>
            <MuiTypography
              variant="subtitle2"
              style={{ color: theme.palette.text.base }}
            >
              {user.attributes.createdAt.toString()}
            </MuiTypography>
            <TabPanels
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              components={[
                {
                  label: 'My Product',
                  component: (
                    <TabPanels
                      value={myProductValue}
                      onChange={(e, newValue) => setMyProductValue(newValue)}
                      components={myProductComponents}
                    />
                  ),
                },
                {
                  label: 'My Purchase',
                  component: (
                    <TabPanels
                      value={myPurchaseValue}
                      onChange={(e, newValue) => setMyPurchaseValue(newValue)}
                      components={myPurchaseComponents}
                    />
                  ),
                },
                {
                  label: 'My Address',
                  component: (
                    <>
                      {addresses.map((address, index) => {
                        return (
                          <div key={index}>
                            <FormModal
                              index={index + 1}
                              open={open[address.id]}
                              deleteOpen={deleteOpen[address.id]}
                              handleOpen={() => handleOpen(address.id)}
                              handleClose={() => handleClose(address.id)}
                              handleDeleteOpen={() =>
                                handleDeleteOpen(address.id)
                              }
                              handleDeleteClose={() =>
                                handleDeleteClose(address.id)
                              }
                              addressId={address.id}
                              setAddress={setAddress}
                              address={address.attributes}
                              modifyAddress={editAddress}
                              deleteAddress={deleteAddress}
                            />
                            <AddressDetail address={address.attributes} />;
                            <hr />
                            <br />
                          </div>
                        );
                      })}

                      <Button
                        variant="contained"
                        onClick={handleOpenAddingNewAddress}
                        label={<h4>Add Address</h4>}
                        style={{ width: '100%' }}
                      />

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
                    </>
                  ),
                },
              ]}
            />
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default UserProfile;
