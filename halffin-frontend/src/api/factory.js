import { useMoralis } from 'react-moralis';
import { abi } from 'api/chain-info/contracts/EscrowFactory.json';

const AddProduct = async (productDetail, factoryAddress) => {
    const { Moralis, user } = useMoralis();
    const web3 = await Moralis.enableWeb3();
    const newPrice = web3.utils.toWei(productDetail.price, 'ether');
    console.log(web3.eth.getAccounts()[0]);
    const contract = new web3.eth.Contract(abi, factoryAddress);
    try {
        contract.methods
            .createProduct(newPrice, productDetail.lockTime)
            .send({ from: user.attributes.ethAddress })
            .on('confirmation', (confirmationNumber, _receipt) => {
                console.log(confirmationNumber);
            })
            .on('receipt', (receipt) => {
                console.log(receipt);
            });
    } catch (e) {
        console.log(e);
        console.log(factoryAddress);
    }
};

export default AddProduct;
