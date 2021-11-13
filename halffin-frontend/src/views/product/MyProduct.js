import { useEffect, useState } from 'react';
// material-ui
import { Box, ButtonBase, Card, Grid, IconButton, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ItemBox from 'ui-component/extended/ItemBox';
import { gridSpacing } from 'store/constant';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { IconCirclePlus } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const MyProduct = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
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
            <ProductCard isLoading={isLoading} />
        </MainCard>
    );
};

export default MyProduct;
