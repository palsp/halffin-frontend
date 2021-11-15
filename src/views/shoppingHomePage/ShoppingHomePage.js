import {useEffect, useState} from 'react';
// material-ui
// project imports
import MainCard from 'ui-component/cards/MainCard';
import {useNavigate} from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import {useProduct} from 'context';

const ShoppingHomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const {products} = useProduct();
  const [mockProduct, setMockProduct] = useState({
    name: 'test',
    description:
      '1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdt1243fsdgfasdts',
    price: 0.001,
    imageUrl: 'https://picsum.photos/200',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleNavigate = (route = '') => {
    console.log('route', route);
    navigate(route);
  };

  console.log(products);

  return (
    <MainCard>
      <ProductCard isLoading={isLoading} product={mockProduct} />
    </MainCard>
  );
};

export default ShoppingHomePage;
