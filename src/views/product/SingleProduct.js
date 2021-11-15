import {useEffect, useState} from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MuiTypography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import {useNavigate} from 'react-router-dom';
import ethIcon from '../../assets/images/icons/eth.svg';

const SingleProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [mockProduct, setMockProduct] = useState({
    name: 'Product name',
    description:
      '1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdts',
    price: 0.001,
    imageUrl: 'https://picsum.photos/200',
  });
  const handleClickAdd = (route = '') => {
    navigate(route);
  };
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
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
                {mockProduct.name}
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="body2" gutterBottom>
                {mockProduct.description}
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h4" gutterBottom>
                Owned by ...
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h2" gutterBottom>
                <img
                  src={ethIcon}
                  alt="ethIcon"
                  style={{width: '35px', height: '35px'}}
                />
                0.000232
              </MuiTypography>
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<AccountBalanceWalletIcon />}>Buy Now</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SingleProduct;
