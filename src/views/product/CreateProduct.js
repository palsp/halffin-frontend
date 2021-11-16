import {useState, useRef} from 'react';

import {useMoralis} from 'react-moralis';
// material-ui
import {Box, Card, Grid, Typography, TextField, Button} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import StepButton from '@mui/material/StepButton';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import {abi} from 'api/chain-info/contracts/EscrowFactory.json';
import {useEscrowFactory} from 'hooks';
import {makeStyles} from '@mui/styles';
import ConnectWallet from '../wallet/ConnectWallet';
import {act} from 'react-dom/cjs/react-dom-test-utils.production.min';

const useStyles = makeStyles(theme => ({
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPposition: 'center',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
  },
}));

const steps = ['Sign transaction', 'Transaction initiated', 'Confirmation'];
const description = [
  'Sign transaction',
  'Creating a product to your account, please wait a moment.',
  '',
];

const CreateProduct = () => {
  const classes = useStyles();
  const {Moralis, authenticate, enableWeb3, user} = useMoralis();
  const theme = useTheme();
  const formRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState();
  const [productDetail, setProductDetail] = useState({
    // name: '',
    // description: '',
    price: 0,
    lockTime: 0,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);

  const {createProduct} = useEscrowFactory();

  const imageChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const handleSubmit = e => {
    e.preventDefault();
    createProduct(productDetail, setNextStep);
    handleClickOpen();
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return activeStep === totalSteps();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setNextStep = (step) => {
    setActiveStep(step);
    console.log('activeStep : ', activeStep);
  };

  const resetStep = () => {
    // setActiveStep(0);
  };

  return (
    <MainCard title="Create new item">
      {!user ? (
        <ConnectWallet sx={{width: '100%'}} />
      ) : (
        <form ref={formRef} noValidate autoComplete="off">
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <input accept="image/*" type="file" onChange={imageChange} />
              {selectedImage && (
                <div
                  className={classes.image}
                  style={{
                    width: '300px',
                    height: '300px',
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
                  setProductDetail({...productDetail, price: e.target.value})
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
            variant="contained"
            color="secondary"
            onClick={e => handleSubmit(e)}
          >
            Create
          </Button>
        </form>
      )}
      <Dialog open={open}>
        <DialogContent>
          <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton color="inherit">{label}</StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              {allStepsCompleted() ? (
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography sx={{mt: 2, mb: 1}} variant="h3">
                    Request Complete
                  </Typography>
                  <Typography sx={{mt: 2, mb: 1}} variant="body1">
                    Your product has been created.
                  </Typography>
                </Grid>
              ) : (
                <>
                  <Typography sx={{mt: 2, mb: 1}}>
                    {description[activeStep]} {}
                  </Typography>
                </>
              )}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 1} onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateProduct;
