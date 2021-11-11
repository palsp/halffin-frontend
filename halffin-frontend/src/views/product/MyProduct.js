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

const MyProduct = () => {
    const navigate = useNavigate();
    const handleClickAdd = (route = '') => {
        navigate(route);
    };
    return (
        <MainCard
            title="My products"
            secondary={
                <IconButton onClick={() => handleClickAdd('/my-product/create')}>
                    <IconCirclePlus />
                </IconButton>
            }
        >
            <SubCard title="Primary Color">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ItemBox bgcolor="primary.light" data={{ label: 'description', color: 'Price' }} title="photo here" dark />
                    </Grid>
                </Grid>
            </SubCard>
        </MainCard>
    );
};

export default MyProduct;
