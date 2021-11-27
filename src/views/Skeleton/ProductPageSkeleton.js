import Skeleton from '@mui/material/Skeleton';
import SubCard from 'ui-component/cards/SubCard';
import { Grid } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { gridSpacing } from 'store/constant';
import MuiTypography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import Card from '@mui/material/Card';
import { IconCurrencyEthereum } from '@tabler/icons';
const ProductPageSkeleton = () => {
  const theme = useTheme();
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
          <Grid
            item
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card>
              <Skeleton variant="rectangular" width={508} height={508} />
            </Card>
          </Grid>
          <Grid item style={{ marginTop: '8px' }}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item>
                <MuiTypography variant="h2" gutterBottom>
                  <Skeleton
                    variant="text"
                    width={120}
                    height={28}
                    sx={{ bgcolor: 'white' }}
                  />
                </MuiTypography>
              </Grid>
              <Grid item style={{ marginTop: '8px' }}>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton
                    variant="text"
                    width={160}
                    height={20}
                    sx={{ bgcolor: 'white' }}
                  />
                </MuiTypography>
              </Grid>
              <Grid item style={{ marginTop: '8px' }}>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton
                    variant="text"
                    width={300}
                    height={20}
                    sx={{ bgcolor: 'white' }}
                  />
                </MuiTypography>
              </Grid>
              <Grid item style={{ marginTop: '8px' }}>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton
                    variant="text"
                    width={126}
                    height={20}
                    sx={{ bgcolor: 'white' }}
                  />
                </MuiTypography>
              </Grid>

              <Grid container direction="row" style={{ marginTop: '8px' }}>
                <Skeleton
                  variant="text"
                  width={220}
                  height={30}
                  sx={{ bgcolor: 'white' }}
                />
                <IconCurrencyEthereum size={35} color="white" />
              </Grid>
              <Grid item style={{ marginTop: '8px' }}>
                <MuiTypography variant="h4" gutterBottom>
                  <Skeleton
                    variant="text"
                    width={117}
                    height={20}
                    sx={{ bgcolor: 'white' }}
                  />
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
