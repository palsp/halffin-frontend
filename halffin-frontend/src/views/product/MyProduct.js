// material-ui
import { Box, Card, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import ItemBox from 'ui-component/extended/ItemBox';
import { gridSpacing } from 'store/constant';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { IconCirclePlus } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
// ==============================|| SAMPLE PAGE ||============================== //

// const navigate = useNavigate();
// const handleClickAdd = () => {
//     navigate('/my-product/create');
// }

const MyProduct = () => {
    const navigate = useNavigate();
    const handleClickAdd = (route = '') => {
        // navigate(route);
        console.log('123');
    };
    return (
        <MainCard title="My products">
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
