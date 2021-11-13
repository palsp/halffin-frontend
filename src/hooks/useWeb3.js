import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

const useWeb3 = () => {
    const { Moralis } = useMoralis();
    const [web3, setWeb3] = useState();
    const [chainId, setChainId] = useState(0);

    useEffect(() => {
        const init = async () => {
            const web3Instance = await Moralis.enableWeb3();
            const currentChainId = await Moralis.getChainId();
            setWeb3(web3Instance);
            setChainId(currentChainId);
        };

        init();
    }, []);

    return { web3, chainId };
};

export default useWeb3;
