import { useState, useRef } from "react";

import { useMoralis } from "react-moralis";
// material-ui
import { Grid, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { useEscrowFactory, useTx, useTransaction } from "hooks";
import { makeStyles } from "@mui/styles";
import ConnectWallet from "../wallet/ConnectWallet";
import TransactionModal from "ui-component/extended/Modal/TransactionModal";
import { IconCamera } from "@tabler/icons";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router";
import fileStorage from "store/filecoin";
import { daysToBlock } from "utils";

import { useFormik } from "formik";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPposition: "center",
    backgroundOrigin: "border-box",
    backgroundClip: "border-box",
  },
  imageInput: {
    display: "flex",
    alignItems: "center",
  },
}));

const validationSchema = yup.object({
  name: yup.string("Enter your email").required("Name is required"),
  description: yup
    .string("Enter description")
    .required("Description is required"),
  price: yup
    .number("Enter price")
    .moreThan(0, "Price must be greater than 0")
    .required("Price is required"),
  lockTime: yup
    .number("Enter lock time")
    .integer("Lock Time must be an integer")
    .moreThan(0, "Price must be greater than 0")
    .required("Lock Time is required"),
});

const CreateProduct = () => {
  const classes = useStyles();
  const { user } = useMoralis();
  const navigate = useNavigate();
  const theme = useTheme();
  const formRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [fileName, setFileName] = useState();
  const [productDetail, setProductDetail] = useState({
    name: "",
    description: "",
    price: 0,
    lockTime: 0,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      lockTime: 0,
    },
    validationSchema,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
  });

  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    "Uploading Information",
    "Sign transaction",
    "Transaction initiated",
    "Confirmation",
  ]);

  const { createProduct } = useEscrowFactory();

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(daysToBlock(+productDetail.lockTime));
    txProps.handleOpen();
    try {
      const ipfsUrl = await fileStorage.uploadToFileCoin(
        fileName,
        selectedImage,
        productDetail.description
      );
      txProps.handleNextStep();
      await signAndSendTransaction(() =>
        createProduct({
          ...productDetail,
          productURI: ipfsUrl,
          lockTime: daysToBlock(+productDetail.lockTime),
        })
      );
      navigate("/user/account-profile", {
        state: { value: 0, myProductValue: 0 },
      });
    } catch (err) {
      txProps.handleError(err);
    }
  };

  return (
    <MainCard title="Create new item">
      {!user ? (
        <ConnectWallet sx={{ width: "100%" }} />
      ) : (
        <>
          <TransactionModal {...txProps} {...txState} />
          <form
            ref={formRef}
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} justifyContent="flex-start">
                <Box
                  sx={{
                    p: 2,
                    border: "1px dashed grey",
                    width: 500,
                    height: 300,
                    display: selectedImage ? "none" : "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor="icon-button-file">
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{ display: "none" }}
                      onChange={imageChange}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <IconCamera />
                    </IconButton>
                  </label>
                </Box>
                {previewImage && (
                  <>
                    <div
                      className={classes.image}
                      style={{
                        width: "300px",
                        height: "300px",
                        backgroundImage: `url(${previewImage})`,
                      }}
                    />
                    <Button
                      onClick={removeSelectedImage}
                      startIcon={<DeleteIcon />}
                    >
                      Remove This Image
                    </Button>
                  </>
                )}
                <TextField
                  fullWidth
                  required
                  id="name"
                  name="name"
                  label="Item Name"
                  margin="normal"
                  type="text"
                  sx={{ ...theme.typography.customInput }}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  fullWidth
                  label="Description"
                  margin="normal"
                  name="description"
                  type="textarea"
                  multiline
                  sx={{
                    ...theme.typography.customInput,
                    "& > div > textarea": {
                      padding: "30px 14px !important",
                    },
                  }}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                <TextField
                  required
                  label="Price"
                  margin="normal"
                  fullWidth
                  name="price"
                  type="number"
                  defaultValue=""
                  sx={{ ...theme.typography.customInput }}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
                <TextField
                  required
                  fullWidth
                  label="Lock Time (in days)"
                  margin="normal"
                  name="lockTime"
                  type="number"
                  sx={{
                    ...theme.typography.customInput,
                  }}
                  value={formik.values.lockTime}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lockTime && Boolean(formik.errors.lockTime)
                  }
                  helperText={formik.touched.lockTime && formik.errors.lockTime}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
            >
              Create
            </Button>
          </form>
        </>
      )}
    </MainCard>
  );
};

export default CreateProduct;
