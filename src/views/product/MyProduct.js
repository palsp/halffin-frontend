import { useEffect, useState } from "react";
// material-ui
import { IconButton } from "@mui/material";
// project imports
import MainCard from "ui-component/cards/MainCard";
import { IconCirclePlus } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const MyProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [mockProduct, setMockProduct] = useState({
    name: "test",
    description:
      "1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdts",
    price: 0.001,
    imageUrl: "https://picsum.photos/200",
  });
  const handleClickAdd = (route = "") => {
    navigate(route);
  };
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <MainCard
      title="My products"
      secondary={
        <IconButton onClick={() => handleClickAdd("/my-product/create")}>
          <IconCirclePlus />
        </IconButton>
      }
    >
      <ProductCard isLoading={isLoading} product={mockProduct} />
    </MainCard>
  );
};

export default MyProduct;
