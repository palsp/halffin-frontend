import PropTypes from 'prop-types';
import {useState} from 'react';

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Avatar, Box, Grid, Menu, MenuItem, Typography} from '@mui/material';
import MuiTypography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import SubCard from 'ui-component/cards/SubCard';
import {gridSpacing, marginLeftProductCard} from 'store/constant';
import ItemBox from 'ui-component/extended/ItemBox';
import ethIcon from '../../assets/images/icons/eth.svg';
// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const ProductCard = ({isLoading, product}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <SubCard title={product.name} style={{width: '275px'}}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            spacing={gridSpacing}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Avatar
                variant="square"
                src={product.imageUrl}
                style={{width: '100%', height: '200px'}}
              />
            </Grid>
            <Grid
              container
              xs={12}
              direction="row"
              justifyContent="center"
              style={{marginTop: '8px'}}
            >
              <Grid item xs={6} md={8}>
                <MuiTypography variant="body2" style={{marginLeft: '22px', paddingRight: '8px', overflow: "hidden", textOverflow: "ellipsis", width: '11rem', wordWrap: "break-word"}}>
                  {product.description}
                </MuiTypography>
              </Grid>
              <Grid item xs={6} md={4}>
                <MuiTypography variant="subtitle1" style={{marginLeft: '22px'}}>
                  <div style={{display: 'flex', justifyContent: 'baseline'}}>
                    <img
                      src={ethIcon}
                      alt="ethIcon"
                      style={{width: '25px', height: '25px'}}
                    />
                    {product.price}
                  </div>
                </MuiTypography>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      )}
    </>
  );
};

ProductCard.propTypes = {
  isLoading: PropTypes.bool,
  product: PropTypes.any,
};

export default ProductCard;
