import {useState, useRef} from 'react';

import {useMoralis} from 'react-moralis';
// material-ui
import {Grid, TextField, Button, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import {useEscrowFactory, useTx, useTransaction} from 'hooks';
import {makeStyles} from '@mui/styles';
import ConnectWallet from '../wallet/ConnectWallet';
import TransactionModal from 'ui-component/extended/Modal/TransactionModal';
import {IconCamera} from '@tabler/icons';
import IconButton from '@mui/material/IconButton';
import fileStorage from 'store/filecoin';
import {useNavigate} from 'react-router';

const useStyles = makeStyles(theme => ({
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPposition: 'center',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
  },
  imageInput: {
    display: 'flex',
    alignItems: 'center',
  },
  colorButton: {
    background: 'white',
    '&:hover': {
      backgroundColor: 'red',
    },
    "&:disabled": {
      backgroundColor: 'red'
    }
  }
}));


const CreateProduct = () => {
  const classes = useStyles();
  const {user} = useMoralis();
  const navigate = useNavigate();
  const theme = useTheme();
  const formRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState();
  const [fileName, setFileName] = useState();
  const [productDetail, setProductDetail] = useState({
    name: '',
    description: '',
    price: 0,
    lockTime: 0,
  });

  const {signAndSendTransaction, txState, ...txProps} = useTransaction([
    'Uploading Information',
    'Sign transaction',
    'Transaction initiated',
    'Confirmation',
  ]);

  const {createProduct} = useEscrowFactory();

  const imageChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    txProps.handleOpen();
    try {
      const ipfsUrl = await fileStorage.uploadToFileCoin(
        fileName,
        selectedImage,
        productDetail.description
      );
      console.log('ipfsUrl :', ipfsUrl);
      txProps.handleNextStep();
      await signAndSendTransaction(() =>
        createProduct({...productDetail, productURI: ipfsUrl})
      );
      navigate('/user/account-profile', {
        state: {value: 0, myProductValue: 0},
      });
    } catch (err) {
      txProps.handleError(err);
    }
  };

  return (
    <MainCard>
      {!user ? (
        <ConnectWallet sx={{width: '100%'}} />
      ) : (
        <>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
          <form ref={formRef} noValidate autoComplete="off">
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} justifyContent="flex-start">
                <Box
                  sx={{
                    p: 2,
                    border: '1px dashed grey',
                    width: 500,
                    height: 300,
                    display: selectedImage ? 'none' : 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <label htmlFor="icon-button-file">
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{display: 'none'}}
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
                {selectedImage && (
                  <>
                    <div
                      className={classes.image}
                      style={{
                        width: '300px',
                        height: '300px',
                        backgroundImage: `url(${URL.createObjectURL(
                          selectedImage
                        )})`,
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
                  label="Item Name"
                  margin="normal"
                  name="productName"
                  type="text"
                  defaultValue=""
                  sx={{...theme.typography.customInput}}
                  value={productDetail.name}
                  onChange={e =>
                    setProductDetail({...productDetail, name: e.target.value})
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
                  sx={{...theme.typography.customInput}}
                  onChange={e =>
                    setProductDetail({
                      ...productDetail,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  required
                  label="Price"
                  margin="normal"
                  name="price"
                  type="number"
                  defaultValue=""
                  sx={{...theme.typography.customInput}}
                  value={productDetail.price}
                  onChange={e =>
                    setProductDetail({
                      ...productDetail,
                      price: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Lock Time"
                  margin="normal"
                  name="description"
                  type="number"
                  defaultValue="3"
                  sx={{...theme.typography.customInput}}
                />
              </Grid>
            </Grid>
            <Button
              disabled={!productDetail.name || productDetail.price <= 0}
              size="large"
              onClick={e => handleSubmit(e)}
              // variant="contained"
              sx={{marginTop: '8px'}}
              className={classes.colorButton}
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
