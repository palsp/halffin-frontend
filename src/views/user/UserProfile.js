import { useState, useEffect } from "react";

// material-ui
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import MainCard from "ui-component/cards/MainCard";
import { useMoralis } from "react-moralis";
import MuiTypography from "@mui/material/Typography";
import { useAddress, useProduct } from "context";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import ProductList from "../product/ProductList/ProductList";
import { shortenIfAddress } from "@usedapp/core";
import TabPanels from "ui-component/extended/TabPanels";
import { useTheme } from "@mui/material/styles";
import AddressDetail from "ui-component/Address/AddressDetail";
import FormModal from "ui-component/Address/FormModal";

const MY_PRODUCT_LABELS = [
  "In Market",
  "Waiting For Shipment",
  "To Be Delivered",
  "To Be Claimed",
  "Complete",
];

const MY_PURCHASE_LABELS = [
  "Waiting For Shipment",
  "To Be Delivered",
  "Complete",
];

const UserProfile = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { address, getAddress, addAddress } = useAddress();

  const [value, setValue] = useState(0);
  const [myPurchaseValue, setMyPurchaseValue] = useState(0);
  const [myProductValue, setMyProductValue] = useState(0);

  const { user, isAuthenticated } = useMoralis();
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
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    getAddress();
  }, [user, open]);

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
      component: <ProductList products={myProduct[index]} />,
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
  const test = "3";
  return (
    <>
      {!user ? (
        <Navigate to="/" />
      ) : (
        <MainCard style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              src="https://picsum.photos/200"
              sx={{ width: 100, height: 100 }}
            />
            <MuiTypography
              variant="subtitle1"
              gutterBottom
              style={{ color: theme.palette.text.base }}
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
                  label: "My Product",
                  component: (
                    <TabPanels
                      value={myProductValue}
                      onChange={(e, newValue) => setMyProductValue(newValue)}
                      components={myProductComponents}
                    />
                  ),
                },
                {
                  label: "My Purchase",
                  component: (
                    <TabPanels
                      value={myPurchaseValue}
                      onChange={(e, newValue) => setMyPurchaseValue(newValue)}
                      components={myPurchaseComponents}
                    />
                  ),
                },
                {
                  label: "My Address",
                  component: (
                    <>
                      <FormModal
                        open={open}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        address={address}
                        addAddress={addAddress}
                      />

                      <AddressDetail address={address} />
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
