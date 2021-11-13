import { useState, useRef, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
// material-ui
import { Box, Card, Grid, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { AlternateEmail } from '@mui/icons-material';
import { abi } from 'api/chain-info/contracts/EscrowFactory.json';
import networkMapping from 'api/chain-info/deployments/map.json';
import { constants } from 'ethers';
import useFactory from 'api/factory';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    image: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPposition: 'center',
        backgroundOrigin: 'border-box',
        backgroundClip: 'border-box'
    }
}));

const CreateProduct = () => {
    const classes = useStyles();
    const { Moralis, authenticate, enableWeb3, isAuthenticated, isWeb3Enabled, user } = useMoralis();
    const web3 = new Moralis.Web3();
    const theme = useTheme();
    const formRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState();
    const [productDetail, setProductDetail] = useState({
        // name: '',
        // description: '',
        price: 0,
        lockTime: 0
    });

    const [factoryAddress, setFactoryAddress] = useState('');
    const { addProduct } = useFactory(factoryAddress);

    const enableAndAuthenticate = async () => {
        await enableWeb3();
        await authenticate();
    };

    const getChainId = async () => {
        const chainId = await Moralis.getChainId();
        console.log(chainId); // 56
        const address = chainId ? networkMapping[chainId.toString()].EscrowFactory[0] : constants.AddressZero;
        setFactoryAddress(address);
    };

    useEffect(() => {
        getChainId();
    }, []);

    const [txState, setTxState] = useState({ status: null });

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage();
    };

    const createProduct = async (productDetail) => {
        const web3 = await Moralis.enableWeb3();
        const newPrice = web3.utils.toWei(productDetail.price, 'ether');
        console.log(web3.eth.getAccounts()[0]);
        const contract = new web3.eth.Contract(abi, factoryAddress.EscrowFactory[0]);
        try {
            contract.methods
                .createProduct(newPrice, productDetail.lockTime)
                .send({ from: user.attributes.ethAddress })
                .on('confirmation', (confirmationNumber, receipt) => {
                    console.log(confirmationNumber);
                })
                .on('receipt', (receipt) => {
                    console.log(receipt);
                });
        } catch (e) {
            setTxState({ status: null });
            console.log(e);
            console.log(factoryAddress.EscrowFactory);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(productDetail);
        // createProduct(productDetail);
        addProduct(productDetail);
    };
    return (
        <MainCard title="Create new item">
            <form ref={formRef} noValidate autoComplete="off">
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6}>
                        <input accept="image/*" type="file" onChange={imageChange} />
                        {selectedImage && (
                            <div
                                className={classes.image}
                                style={{ width: '300px', height: '300px', backgroundImage: `url(${URL.createObjectURL(selectedImage)})` }}
                            >
                                {/* <img src={URL.createObjectURL(selectedImage)} alt="" /> */}
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
                <Button
                    disabled={!productDetail.name || productDetail.price <= 0}
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={(e) => handleSubmit(e)}
                >
                    Create
                </Button>
            </form>
        </MainCard>
    );
};

export default CreateProduct;
