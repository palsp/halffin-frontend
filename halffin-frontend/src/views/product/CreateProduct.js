import { useState, useRef } from 'react';
// material-ui
import { Box, Card, Grid, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

const CreateProduct = () => {
    const theme = useTheme();
    const [selectedImage, setSelectedImage] = useState();
    const [productDetail, setProductDetail] = useState({
        name: '',
        description: '',
        price: 0,
        lockTime: 0
    });
    const [isEnableSubmitForm, setIsEnableSumbitForm] = useState(false);
    const checkStateSubmitForm = () => {
        if (productDetail.name && productDetail.price > 0 && productDetail.lockTime > 0) {
            setIsEnableSumbitForm(true);
        }
    };

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage();
        console.log(productDetail);
    };

    const handleSubmit = (e) => {
        e.preventDeafult();
        console.log(productDetail);
    };

    return (
        <MainCard title="Create new item">
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6}>
                        <input accept="image/*" type="file" onChange={imageChange} />
                        {selectedImage && (
                            <div>
                                <img src={URL.createObjectURL(selectedImage)} alt="" />
                                <Button onClick={removeSelectedImage} startIcon={<DeleteIcon />}>
                                    Remove This Image
                                </Button>
                            </div>
                        )}
                        <TextField
                            fullWidth
                            required
                            label="Item Name"
                            margin="normal"
                            name="productName"
                            type="text"
                            defaultValue=""
                            sx={{ ...theme.typography.customInput }}
                            value={productDetail.name}
                            onChange={(e) => setProductDetail({ ...productDetail, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            margin="normal"
                            name="description"
                            type="text"
                            defaultValue=""
                            multiline
                            rows={4}
                            sx={{ ...theme.typography.customInput }}
                        />
                        <TextField
                            required
                            label="Price"
                            margin="normal"
                            name="price"
                            type="number"
                            defaultValue=""
                            sx={{ ...theme.typography.customInput }}
                            value={productDetail.price}
                            onChange={(e) => setProductDetail({ ...productDetail, price: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Lock Time"
                            margin="normal"
                            name="description"
                            type="number"
                            defaultValue="3"
                            sx={{ ...theme.typography.customInput }}
                        />
                    </Grid>
                </Grid>
                <Button disabled={!productDetail.name || productDetail.price <= 0} size="large" variant="contained" color="secondary">
                    Create
                </Button>
            </form>
        </MainCard>
    );
};

export default CreateProduct;
