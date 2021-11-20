import { Grid } from "@mui/material";
import ProductCard from "../ProductCard";

const Products = ({ products, isLoading }) => {
  return (
    <Grid container
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
    spacing={4}>
      {products.map((product) => (
        <Grid item>
          <ProductCard key={product.name} isLoading={isLoading} product={product} />
        </Grid>
      ))}
    </Grid>
  )
};

export default Products;
