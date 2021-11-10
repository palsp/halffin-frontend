// material-ui
import { Box, Card, Grid, Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

const CreateProduct = () => {
    const theme = useTheme();
    return (
        <MainCard title="Create new item">
            <SubCard title="Primary Color">
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <form noValidate>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        margin="normal"
                                        name="fname"
                                        type="text"
                                        defaultValue=""
                                        sx={{ ...theme.typography.customInput }}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </SubCard>
        </MainCard>
    );
};

export default CreateProduct;
