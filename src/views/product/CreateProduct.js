import { useState, useRef } from 'react';

import { useMoralis } from 'react-moralis';
// material-ui
import { Grid, TextField, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useEscrowFactory, useTransaction } from 'hooks';
import { makeStyles } from '@mui/styles';
import ConnectWallet from '../wallet/ConnectWallet';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import { IconCamera } from '@tabler/icons';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router';
import fileStorage from 'store/filecoin';
import { daysToBlock } from 'utils';
import Button from 'ui-component/extended/Button';

import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPposition: 'center center',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
  },
  imageInput: {
    display: 'flex',
    alignItems: 'center',
  },
  colorButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    '&:hover': {
      background: 'white',
      color: 'rgba(0,0,0,0.8)',
    },
  },
  errorText: {
    color: '#f44336',
    fontSize: '0.75rem',
    fontWeight: 400,
    fontFamily: 'inherit',
    lineHeight: 1.66,
    textAlign: 'left',
    marginTop: '3px',
    marginRight: '14px',
    marginBottom: 0,
    marginLeft: '14px',
  },
}));

const validationSchema = yup.object({
  name: yup.string('Enter your email').required('Name is required'),
  description: yup
    .string('Enter description')
    .required('Description is required'),
  price: yup
    .number('Enter price')
    .moreThan(0, 'Price must be greater than 0')
    .required('Price is required'),
  lockTime: yup
    .number('Enter lock time')
    .integer('Lock Time must be an integer')
    .min(0, 'Price must be greater than 0')
    .required('Lock Time is required'),
  file: yup.mixed().required('Image is required'),
});

const CreateProduct = () => {
  const classes = useStyles();
  const { user } = useMoralis();
  const navigate = useNavigate();
  const theme = useTheme();
  const formRef = useRef(null);
  const [previewImage, setPreviewImage] = useState();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      lockTime: 0,
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => handleSubmit(values),
  });

  const { signAndSendTransaction, txState, ...txProps } = useTransaction([
    'Uploading Information',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);

  const { createProduct } = useEscrowFactory();

  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      formik.setFieldValue('file', e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }

    await formik.setFieldTouched('file', true);
    await formik.validateField('file');
  };

  const removeSelectedImage = () => {
    formik.setFieldValue('file', null);
    setPreviewImage(null);
  };

  const handleSubmit = async (formValues) => {
    txProps.handleOpen();
    try {
      const ipfsUrl = await fileStorage.uploadToFileCoin(
        formValues.file.name,
        formValues.file,
        formValues.description
      );
      txProps.handleNextStep();
      await signAndSendTransaction(() =>
        createProduct({
          ...formValues,
          productURI: ipfsUrl,
          lockTime: daysToBlock(formValues.lockTime),
        })
      );
      navigate('/user/account-profile', {
        state: { value: 0, myProductValue: 0 },
      });
    } catch (err) {
      txProps.handleError(err);
    }
  };

  return (
    <MainCard>
      <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h1"
            style={{
              color: theme.palette.text.base,
              marginTop: '24px',
              marginBottom: '26px',
            }}
          >
            Create new item
          </Typography>
        </div>
        <TransactionModal {...txProps} {...txState} />
        <form
          ref={formRef}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <Box
                sx={{
                  p: 2,
                  border:
                    formik.touched.file && formik.errors.file
                      ? '3px dashed red'
                      : '3px dashed white',
                  width: 500,
                  height: 300,
                  display: formik.values.file ? 'none' : 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <label htmlFor="icon-button-file">
                  <input
                    accept="image/*"
                    id="icon-button-file"
                    name="file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={imageChange}
                  />
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    sx={{ color: 'white' }}
                  >
                    <IconCamera />
                  </IconButton>
                </label>
              </Box>
              {formik.touched.file && formik.errors.file && (
                <p className={classes.errorText}>{formik.errors.file}</p>
              )}
              {previewImage && (
                <>
                  <div
                    className={classes.image}
                    style={{
                      width: '500px',
                      height: '300px',
                      backgroundImage: `url(${previewImage})`,
                    }}
                  />
                  <Button
                    onClick={removeSelectedImage}
                    icon={<DeleteIcon />}
                    label={<h4>Remove This Image</h4>}
                    sx={{
                      backgroundColor: 'transparent',
                      '.MuiChip-icon': {
                        color: theme.palette.text.base,
                      },
                      '&:hover': {
                        background: 'transparent !important',
                        color: `${theme.palette.primary.main}!important`,
                        '& svg': {
                          color: theme.palette.primary.main,
                          stroke: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6} justifyContent="flex-start">
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
                  '& > div > textarea': {
                    padding: '30px 14px !important',
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

              {!user ? (
                <ConnectWallet sx={{ width: '100%' }} />
              ) : (
                <Button
                  sx={{ width: '100%', marginTop: '8px' }}
                  label={<h4>Create</h4>}
                  onClick={formik.handleSubmit}
                />
              )}
            </Grid>
          </Grid>
        </form>
      </>
    </MainCard>
  );
};

export default CreateProduct;
