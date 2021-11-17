import Skeleton from '@mui/material/Skeleton';
import SubCard from 'ui-component/cards/SubCard';
import {Grid} from '@mui/material';
import {gridSpacing} from 'store/constant';
import ethIcon from '../../assets/images/icons/eth.svg';
import MuiTypography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import Card from '@mui/material/Card';
const ProductPageSkeleton = () => {
  return (
    <>
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
              <Skeleton variant="rectangular" width={508} height={508} />
            </Card>
          </Grid>
          <Grid item style={{marginTop: '8px'}}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <MuiTypography variant="h2" gutterBottom>
                  <Skeleton variant="text" width={60} height={40} />
                </MuiTypography>
              </Grid>
              <Grid item>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton variant="text" width={160} height={40} />
                </MuiTypography>
              </Grid>
              <Grid item>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton variant="text" width={516} height={40} />
                </MuiTypography>
              </Grid>
              <Grid item>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton variant="text" width={100} height={40} />
                </MuiTypography>
              </Grid>

              <Grid item>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton variant="text" width={140} height={40} />
                </MuiTypography>
              </Grid>
              <Grid item>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton variant="text" width={100} height={40} />
                </MuiTypography>
              </Grid>

              <Grid container direction="row" justifyContent="flex-start">
                <MuiTypography variant="h2" gutterBottom textAlign="center">
                  <Skeleton variant="text" width={140} height={40} />
                </MuiTypography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default ProductPageSkeleton;
