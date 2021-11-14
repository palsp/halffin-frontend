import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const Products = ({ products, isLoading }) => (
  <Grid container spacing={3}>
    {products.map((product) => (
      <ProductCard key={product.name} isLoading={isLoading} product={product} />
    ))}
  </Grid>
);

export default Products;
