import { useState, useEffect } from 'react';

import { useMoralis } from 'react-moralis';
import { abi } from 'api/chain-info/contracts/EscrowFactory.json';
import networkMapping from 'api/chain-info/deployments/map.json';
import { constants } from 'ethers';
import { useWeb3 } from 'hooks';

const useEscrowFactory = () => {
    const { web3, chainId } = useWeb3();
    const { user } = useMoralis();
    const [contract, setContract] = useState();

    const getFactoryAddress = async () => {
        const address = chainId ? networkMapping[chainId.toString()].EscrowFactory[0] : constants.AddressZero;
        return address;
    };

    useEffect(() => {
        const init = async () => {
            const factoryAddress = await getFactoryAddress();
            const contractInstance = new web3.eth.Contract(abi, factoryAddress);
            setContract(contractInstance);
        };

        init();
    }, []);

    const createProduct = (productDetail) => {
        const newPrice = web3.utils.toWei(productDetail.price, 'ether');
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

    return { createProduct };
};

export default useEscrowFactory;
