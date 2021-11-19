import Skeleton from '@mui/material/Skeleton';
import SubCard from 'ui-component/cards/SubCard';
import {Avatar, Grid, CardActionArea} from '@mui/material';
import {gridSpacing} from 'store/constant';
import ethIcon from '../../assets/images/icons/eth.svg';
import MuiTypography from '@mui/material/Typography';

const ProductSkeleton = () => {
  return (
    <>
      {/* <Skeleton variant="rectangular" width={210} height={118} /> */}
      <Grid item lg={4} md={6} sm={6} xs={12}>
        <SubCard style={{width: '275px', backgroundColor: `rgba(107,195,238,0.1)`}}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            spacing={gridSpacing}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
            <Grid
              container
              xs={12}
              direction="row"
              justifyContent="center"
              style={{marginTop: '8px'}}
            >
              <Grid item xs={6} md={4}>
                <MuiTypography variant="subtitle1" style={{marginLeft: '22px'}}>
                  <div style={{display: 'flex', justifyContent: 'baseline'}}>
                    <img
                      src={ethIcon}
                      alt="ethIcon"
                      style={{width: '25px', height: '25px'}}
                    />
                    <Skeleton variant="text" width={38} />
                  </div>
                </MuiTypography>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </>
  );
};

export default ProductSkeleton;
