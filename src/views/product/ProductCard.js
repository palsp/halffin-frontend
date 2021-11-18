import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Grid, CardActionArea } from "@mui/material";
import MuiTypography from "@mui/material/Typography";

// project imports
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";
import ethIcon from "../../assets/images/icons/eth.svg";

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const ProductCard = ({ isLoading, product }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigate = (route = "") => {
    navigate(route);
  };

  const cardTitle = [product.name];
  if (!product.isAbleToBuy) {
    cardTitle.push("-");
    cardTitle.push(product.stage.toUpperCase());
  }

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <SubCard
            title={cardTitle.join(" ")}
            style={{
              width: "275px",
              backgroundColor: theme.palette.stage[product._stage],
            }}
          >
            <CardActionArea
              onClick={() => handleNavigate(`/product/${product.id}`)}
            >
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                spacing={gridSpacing}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <Avatar
                    variant="square"
                    src="https://picsum.photos/200"
                    style={{ width: "100%", height: "200px" }}
                  />
                </Grid>
                <Grid
                  container
                  xs={12}
                  direction="row"
                  justifyContent="center"
                  style={{ marginTop: "8px" }}
                >
                  <Grid
                    container
                    xs={6}
                    md={4}
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginLeft: "20px" }}
                  >
                    <Grid item>
                      <MuiTypography variant="subtitle1">
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
                          {product.price}
                        </div>
                      </MuiTypography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardActionArea>
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
