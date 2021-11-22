import { Grid } from "@mui/material";
import { useMoralis } from "react-moralis";
import ProgressBar from "ui-component/extended/ProgressBar";
import stages from "api/stage";
import { addressEqual } from "@usedapp/core";
import SellerView from "./SellerView/SellerView";
import BuyerView from "./BuyerView/BuyerView";

const ProductView = ({ product, handleUpdate, isDeliveredFail }) => {
  const { user } = useMoralis();
  return (
    <>
      <Grid item>
        <ProgressBar
          steps={Object.values(stages)}
          activeStep={+product._stage}
        />
      </Grid>
      <Grid item>
        {addressEqual(user.attributes.ethAddress, product.owner) ? (
          <SellerView
            product={product}
            onUpdate={handleUpdate}
            isDeliveredFail={isDeliveredFail}
          />
        ) : (
          <BuyerView
            product={product}
            onUpdate={handleUpdate}
            isDeliveredFail={isDeliveredFail}
          />
        )}
      </Grid>
    </>
  );
};

export default ProductView;
