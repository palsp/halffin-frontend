import { useState, useEffect } from "react";
import BuyerView from "./BuyerView/BuyerView";
import SellerView from "./SellerView/SellerView";
// material-ui
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MuiTypography from "@mui/material/Typography";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "context";
import { useMoralis } from "react-moralis";
import ConnectWallet from "../../wallet/ConnectWallet";
import MainCard from "ui-component/cards/MainCard";
import { shortenIfAddress, addressEqual } from "@usedapp/core";
import ProgressBar from "ui-component/extended/ProgressBar";
import stages from "api/stage";
import ProductPageSkeleton from "../../Skeleton/ProductPageSkeleton";
import axios from "axios";
import fileStorage from "store/filecoin";
import BaseImage from "ui-component/extended/BaseImage";
import Product from "model/Product";
import {useTheme} from "@mui/material/styles"
import { IconCurrencyEthereum } from '@tabler/icons';

const ProductPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProductInfo } = useProduct();
  const { user } = useMoralis();
  const [product, setProduct] = useState(new Product({}));
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const handleUpdate = async (_id) => {
    const newProduct = await updateProductInfo(_id);
    setProduct(newProduct);
  };

  useEffect(() => {
    const prod = getProductById(id);
    console.log(prod);
    if (!prod) {
      // go back to prev page
      navigate("/");
    }
    setProduct(prod);
    setIsLoading(false);
  }, [id]);

  return (
    <>
      {isLoading ? (
        <ProductPageSkeleton />
      ) : (
        <MainCard>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={3}
          >
            <Grid
              item
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BaseImage
                product={product}
                isLoading={isImageLoading}
                onFinishLoading={() => setIsImageLoading(false)}
                onStartLoading={() => setIsImageLoading(true)}
                sx={{
                  width: "50%",
                  height: "40vh",
                }}
              />
            </Grid>
            <Grid item style={{ marginTop: "8px" }}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}
              >
                <Grid item> 
                  <MuiTypography variant="h2" gutterBottom style={{color: theme.palette.text.base}}>
                    {product.name}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom style={{color: theme.palette.text.base}}>
                    Owner: {shortenIfAddress(product.owner)}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom style={{color: theme.palette.text.base}}>
                    Contract Address: {product.address}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom style={{color: theme.palette.text.base}}>
                    Stage: {product.stage}
                  </MuiTypography>
                </Grid>
                {product.trackingId != "" && (
                  <Grid item>
                    <MuiTypography variant="h4" gutterBottom style={{color: theme.palette.text.base}}>
                      Tracking ID: {product.trackingId}
                    </MuiTypography>
                  </Grid>
                )}
                {product.deliveryStatus !== "" && (
                  <Grid item>
                    <MuiTypography variant="h4" gutterBottom style={{color: theme.palette.text.base}}>
                      Delivery Status: {product.deliveryStatus}
                    </MuiTypography>
                  </Grid>
                )}

                <Grid item>
                  <MuiTypography variant="h2" gutterBottom textAlign="center" style={{color: theme.palette.text.base}}>
                    Price: {product.price}
                    <IconCurrencyEthereum size={35} color="white" />
                  </MuiTypography>
                </Grid>
                {!user && (
                  <Grid item>
                    <ConnectWallet />
                  </Grid>
                )}
                {user && (
                  <Grid item>
                    <ProgressBar
                      steps={Object.values(stages)}
                      activeStep={+product._stage}
                    />
                  </Grid>
                )}
                {user &&
                addressEqual(user.attributes.ethAddress, product.owner) ? (
                  <SellerView product={product} onUpdate={handleUpdate} />
                ) : (
                  <BuyerView product={product} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default ProductPage;
