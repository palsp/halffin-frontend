import { useState, useEffect } from "react";
// material-ui
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import MainCard from "ui-component/cards/MainCard";
import { useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import MuiTypography from "@mui/material/Typography";
import { useProduct } from "context";
import { useNavigate } from "react-router-dom";
import ProductList from "../product/ProductList/ProductList";

import { useLocation } from "react-router-dom";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const UserProfile = () => {
  const [value, setValue] = useState(0);
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
            {isAuthenticated ? user.attributes.username : ""}
          </MuiTypography>
          <MuiTypography variant="subtitle2">
            {isAuthenticated ? user.attributes.createdAt.toString() : ""}
          </MuiTypography>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="My Product" />
            <Tab label="My Purchase" />
            <Tab label="To Confirm" />
          </Tabs>
          <TabPanel value={value} index={0}>
            {user && (
              <ProductList
                products={getProductsOfSeller(user.attributes.ethAddress)}
              />
            )}
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
          </TabPanel>
        </Grid>
      </MainCard>
    </>
  );
};

export default UserProfile;
