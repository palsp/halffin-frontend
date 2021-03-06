import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const useWeb3 = () => {
  const { Moralis } = useMoralis();
  const [web3, setWeb3] = useState();
  const [web3Utils] = useState(new Moralis.Web3().utils);
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

  return { web3, chainId, web3Utils };
};

export default useWeb3;
