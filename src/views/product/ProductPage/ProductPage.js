import {useState, useEffect} from 'react';
import BuyerView from './BuyerView/BuyerView';
import SellerView from './SellerView/SellerView';
// material-ui
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MuiTypography from '@mui/material/Typography';
import {useParams, useNavigate} from 'react-router-dom';
import {useProduct} from 'context';
import Product from 'model/Product';
import {useMoralis} from 'react-moralis';
import ConnectWallet from '../../wallet/ConnectWallet';
import MainCard from 'ui-component/cards/MainCard';
import ethIcon from 'assets/images/icons/eth.svg';
import {shortenIfAddress, addressEqual} from '@usedapp/core';
import ProductPageSkeleton from '../../Skeleton/ProductPageSkeleton';
import axios from "axios";

const ProductPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {getProductById, updateProductInfo} = useProduct();
  const {user} = useMoralis();
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState();
  const handleUpdate = async _id => {
    const newProduct = await updateProductInfo(_id);
    setProduct(newProduct);
  };

  useEffect(() => {
    const prod = getProductById(id);
    const url = "https://picsum.photos/508";
    axios
    .get(
      url,
      {
        responseType: "arraybuffer",
      }
    )
    .then((response) => {
      setImage(Buffer.from(response.data, "binary").toString("base64"))
      setIsLoading(false);
    }
    );
    if (!prod) {
      // go back to prev page
      navigate(-1);
    }
    setProduct(prod);
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
            <Grid item>
              <Card>
                <img src="https://picsum.photos/508" alt="Product Image" />
              </Card>
            </Grid>
            <Grid item style={{marginTop: '8px'}}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}
              >
                <Grid item>
                  <MuiTypography variant="h2" gutterBottom>
                    {product.name}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom>
                    Owner: {shortenIfAddress(product.owner)}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom>
                    Contract Address: {product.address}
                  </MuiTypography>
                </Grid>
                <Grid item>
                  <MuiTypography variant="h4" gutterBottom>
                    Stage: {product.stage}
                  </MuiTypography>
                </Grid>
                {product.trackingId != '' && (
                  <Grid item>
                    <MuiTypography variant="h4" gutterBottom>
                      Tracking ID: {product.trackingId}
                    </MuiTypography>
                  </Grid>
                )}
                {product.deliveryStatus !== '' && (
                  <Grid item>
                    <MuiTypography variant="h4" gutterBottom>
                      Delivery Status: {product.deliveryStatus}
                    </MuiTypography>
                  </Grid>
                )}

                <Grid item>
                  <MuiTypography variant="h2" gutterBottom textAlign="center">
                    Price: {product.price}
                    <img
                      src={ethIcon}
                      alt="ethIcon"
                      style={{width: '35px', height: '35px'}}
                    />
                  </MuiTypography>
                </Grid>
                {!user && (
                  <Grid item>
                    <ConnectWallet />
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
