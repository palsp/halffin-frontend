import { useState, useEffect } from "react";
// material-ui
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import MainCard from "ui-component/cards/MainCard";
import { useMoralis } from "react-moralis";
import MuiTypography from "@mui/material/Typography";
import { useProduct } from "context";
import { useNavigate, useLocation } from "react-router-dom";
import ProductList from "../product/ProductList/ProductList";

import { shortenIfAddress } from "@usedapp/core";
import TabPanels from "ui-component/extended/TabPanels";

const UserProfile = () => {
  const [value, setValue] = useState(0);
  const [myPurchaseValue, setMyPurchaseValue] = useState(0);
  const [myProductValue, setMyProductValue] = useState(0);

  const { user, isAuthenticated } = useMoralis();
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    if (state && state.value && state.value < 3) {
      setValue(state.value);
    }
  }, [state]);
  const { getProductsOfSeller, getProductsOfBuyer } = useProduct();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const handleChange = (event, newvalue) => {
    setValue(newvalue);
  };

  let productsOfSeller = [];
  let productsOfBuyers = [];
  if (user) {
    productsOfSeller = getProductsOfSeller(user.attributes.ethAddress);
    productsOfBuyers = getProductsOfBuyer(user.attributes.ethAddress);
  }

  return (
    <>
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
          <MuiTypography variant="subtitle1" gutterBottom>
            {isAuthenticated
              ? shortenIfAddress(user.attributes.ethAddress)
              : ""}
          </MuiTypography>
          <MuiTypography variant="subtitle2">
            {isAuthenticated ? user.attributes.createdAt.toString() : ""}
          </MuiTypography>
          <TabPanels
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            labels={["My Product", "My Purchase"]}
            components={[
              <TabPanels
                value={myPurchaseValue}
                onChange={(e, newValue) => setMyPurchaseValue(newValue)}
                labels={[
                  "My product",
                  "Waiting For Shipment",
                  "To Be Delivered",
                  "To Be Claimed",
                  "Complete",
                ]}
                components={[
                  <ProductList
                    products={productsOfSeller.filter(
                      (product) => product.isAbleToBuy
                    )}
                  />
                  ,
                  <ProductList
                    products={productsOfSeller.filter(
                      (product) => product.isWaitForShipping
                    )}
                  />,
                  <ProductList
                    products={productsOfSeller.filter(
                      (product) => product.isAbleToCheckTrackingStatus
                    )}
                  />,
                  <ProductList
                    products={productsOfSeller.filter(
                      (product) => product.isAbleToClaimFund
                    )}
                  />,
                  <ProductList
                    products={productsOfSeller.filter(
                      (product) => product.isEnd
                    )}
                  />,
                ]}
              />,
              <TabPanels
                value={myProductValue}
                onChange={(e, newValue) => setMyProductValue(newValue)}
                labels={["Waiting For Shipment", "To Be Delivered", "Complete"]}
                components={[
                  <ProductList
                    products={productsOfBuyers.filter(
                      (product) => product.isWaitForShipping
                    )}
                  />,
                  <ProductList
                    products={productsOfBuyers.filter(
                      (product) => product.isAbleToCheckTrackingStatus
                    )}
                  />,
                  <ProductList
                    products={productsOfBuyers.filter(
                      (product) => product.isAbleToClaimFund || product.isEnd
                    )}
                  />,
                ]}
              />,
            ]}
          />
          {/* <Tabs value={value} onChange={handleChange}>
            <Tab label="My Product" />
            <Tab label="My Purchase" />
            <Tab label="To Confirm" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <MyPurchase
              labels={[
                "Waiting For Shipment",
                "To Be Delivered",
                "To Be Claimed",
                "Complete",
              ]}
              components={[
                <ProductList
                  products={productsOfSeller.filter(
                    (product) => product.isWaitForShipping
                  )}
                />,
                <ProductList
                  products={productsOfSeller.filter(
                    (product) => product.isAbleToCheckTrackingStatus
                  )}
                />,
                <ProductList
                  products={productsOfSeller.filter(
                    (product) => product.isAbleToClaimFund
                  )}
                />,
                <ProductList
                  products={productsOfSeller.filter((product) => product.isEnd)}
                />,
              ]}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {user && (
              <ProductList
                products={getProductsOfBuyer(user.attributes.ethAddress)}
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            To Confirm
          </TabPanel> */}
        </Grid>
      </MainCard>
    </>
  );
};

export default UserProfile;
