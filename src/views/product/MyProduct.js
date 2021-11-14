import {useEffect, useState} from 'react';
// material-ui
import {
  Box,
  ButtonBase,
  Card,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ItemBox from 'ui-component/extended/ItemBox';
import {gridSpacing} from 'store/constant';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import {IconCirclePlus} from '@tabler/icons';
import {useNavigate} from 'react-router-dom';
import ProductCard from './ProductCard';

const MyProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [mockProduct, setMockProduct] = useState({
    name: 'test',
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
    <MainCard
      title="My products"
      secondary={
        <IconButton onClick={() => handleClickAdd('/my-product/create')}>
          <IconCirclePlus />
        </IconButton>
      }
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
      >
        <Grid item xs="auto">
          <ProductCard isLoading={isLoading} product={mockProduct} />
        </Grid>
        <Grid item xs="auto">
          <ProductCard isLoading={isLoading} product={mockProduct} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default MyProduct;
