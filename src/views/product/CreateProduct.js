import { useState, useRef } from "react";

import { useMoralis } from "react-moralis";
// material-ui
import { Grid, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { useEscrowFactory, useTx } from "hooks";
import { makeStyles } from "@mui/styles";
import ConnectWallet from "../wallet/ConnectWallet";

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPposition: "center",
    backgroundOrigin: "border-box",
    backgroundClip: "border-box",
  },
}));

const steps = ["Sign transaction", "Transaction initiated", "Confirmation"];
const description = [
  "Sign transaction",
  "Creating a product to your account, please wait a moment.",
  "",
];

const CreateProduct = () => {
  const classes = useStyles();
  const { Moralis, authenticate, enableWeb3, user } = useMoralis();
  const theme = useTheme();
  const formRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState();
  const [productDetail, setProductDetail] = useState({
    // name: '',
    // description: '',
    price: 0,
    lockTime: 0,
  });

  const { signAndSendTransaction, handleOpen } = useTx();

  const { createProduct } = useEscrowFactory();

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signAndSendTransaction(() => createProduct(productDetail));
    handleOpen();
  };

  return (
    <MainCard title="Create new item">
      {!user ? (
        <ConnectWallet sx={{ width: "100%" }} />
      ) : (
        <form ref={formRef} noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <input accept="image/*" type="file" onChange={imageChange} />
              {selectedImage && (
                <div
                  className={classes.image}
                  style={{
                    width: "300px",
                    height: "300px",
                    backgroundImage: `url(${URL.createObjectURL(
                      selectedImage
                    )})`,
                  }}
                >
                  {/* <img src={URL.createObjectURL(selectedImage)} alt="" /> */}
                  <Button
                    onClick={removeSelectedImage}
                    startIcon={<DeleteIcon />}
                  >
                    Remove This Image
                  </Button>
                </div>
              )}
              <TextField
                fullWidth
                required
                label="Item Name"
                margin="normal"
                name="productName"
                type="text"
                defaultValue=""
                sx={{ ...theme.typography.customInput }}
                value={productDetail.name}
                onChange={(e) =>
                  setProductDetail({ ...productDetail, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                name="description"
                type="text"
                defaultValue=""
                multiline
                rows={4}
                sx={{ ...theme.typography.customInput }}
              />
              <TextField
                required
                label="Price"
                margin="normal"
                name="price"
                type="number"
                defaultValue=""
                sx={{ ...theme.typography.customInput }}
                value={productDetail.price}
                onChange={(e) =>
                  setProductDetail({ ...productDetail, price: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Lock Time"
                margin="normal"
                name="description"
                type="number"
                defaultValue="3"
                sx={{ ...theme.typography.customInput }}
              />
            </Grid>
          </Grid>
          <Button
            disabled={!productDetail.name || productDetail.price <= 0}
            size="large"
            variant="contained"
            color="secondary"
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </Button>
        </form>
      )}
    </MainCard>
  );
};

export default CreateProduct;
