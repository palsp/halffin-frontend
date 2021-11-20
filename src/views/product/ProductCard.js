import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Grid, CardActionArea, Skeleton } from "@mui/material";
import MuiTypography from "@mui/material/Typography";

// project imports
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";
import ethIcon from "assets/images/icons/eth.svg";
import { getImageAsync } from "utils";
import BaseImage from "../../ui-component/extended/BaseImage";

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const ProductCard = ({ isLoading, product }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const handleNavigate = (route = "") => {
    navigate(route);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <SubCard
            sx={{
              width: "275px",
              height: "300px",
              backgroundColor: `rgba(107,195,238,0.1)`,
              border: `1px solid white`,
              borderRadius: "10px",
              padding: "0px",
            }}
            onClick={() => handleNavigate(`/product/${product.id}`)}
            actionSX={{
              ":hover": {
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(95.5deg, rgba(0, 0, 0, 0.3) 12.82%, rgba(70, 72, 70, 0.3) 41.96%, rgba(15, 53, 70, 0.08) 75.06%, rgba(15, 53, 255, 0.11) 107.66%) ",
              },
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="space-between"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={12} md={12}>
                <BaseImage
                  product={product}
                  isLoading={isImageLoading}
                  onStartLoading={() => setIsImageLoading(true)}
                  onFinishLoading={() => setIsImageLoading(false)}
                />
              </Grid>
                <Grid
                  container
                  xs={6}
                  md={4}
                  direction="row"
                >
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <MuiTypography
                        variant="subtitle1"
                        width="100%"
                        sx={{ display: "flex" }}
                        color={theme.palette.text.base}
                      >
                        {product.nameForDisplay}
                      </MuiTypography>
                    </div>
                  </Grid>
                  <Grid item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "baseline",
                      }}
                    >
                      <img
                        src={ethIcon}
                        alt="ethIcon"
                        style={{ width: "25px", height: "25px" }}
                      />
                      <MuiTypography
                        variant="subtitle1"
                        color={theme.palette.text.base}
                      >
                        {product.price}
                      </MuiTypography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            {/* </CardActionArea> */}
          </SubCard>
        </Grid>
      )}
    </>
  );
};

ProductCard.propTypes = {
  isLoading: PropTypes.any,
  product: PropTypes.any,
};

export default ProductCard;
