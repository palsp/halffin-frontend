import { useState, useEffect } from 'react';

import { useMoralis } from 'react-moralis';
import { abi } from 'api/chain-info/contracts/EscrowFactory.json';
import networkMapping from 'api/chain-info/deployments/map.json';
import { constants } from 'ethers';

const useFactory = () => {
    const { Moralis, user } = useMoralis();
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState();

    const getFactoryAddress = async () => {
        const chainId = await Moralis.getChainId();
        console.log(chainId); // 56
        const address = chainId ? networkMapping[chainId.toString()].EscrowFactory[0] : constants.AddressZero;
        return address;
    };

    useEffect(() => {
        const init = async () => {
            const web3Instance = await Moralis.enableWeb3();
            const factoryAddress = await getFactoryAddress();
            const contractInstance = new web3Instance.eth.Contract(abi, factoryAddress);
            setWeb3(web3Instance);
            setContract(contractInstance);
        };

        init();
    }, []);

    const addProduct = (productDetail) => {
        const newPrice = web3.utils.toWei(productDetail.price, 'ether');
        console.log(web3.eth.getAccounts()[0]);
        try {
            contract.methods
                .createProduct(newPrice, productDetail.lockTime)
                .send({ from: user.attributes.ethAddress })
                .on('confirmation', (confirmationNumber, _receipt) => {
                    console.log(confirmationNumber);
                })
                .on('receipt', (receipt) => {
                    console.log(receipt);
                })
                .on('error', (error, receipt) => {
                    console.log('on error', error);
                });
        } catch (e) {
            console.log(e);
        }
    };

    return { addProduct };
};

export default useFactory;
