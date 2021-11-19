import { useState, useEffect } from "react";

import { useMoralis } from "react-moralis";
import { abi } from "api/chain-info/contracts/EscrowFactory.json";
import networkMapping from "api/chain-info/deployments/map.json";
import { constants } from "ethers";
import useWeb3 from "hooks/useWeb3";

const useEscrowFactory = () => {
  const { user, Moralis } = useMoralis();
  const [contract, setContract] = useState();
  const [factoryAddress, setFactoryAddress] = useState();
  const [web3, setWeb3] = useState(null);
  const { web3Utils } = useWeb3();

  useEffect(() => {
    const init = async () => {
      const web3Instance = await Moralis.enableWeb3();
      const chainId = await Moralis.getChainId();
      const address = chainId
        ? networkMapping[chainId.toString()].EscrowFactory[0]
        : constants.AddressZero;
      const contractInstance = new web3Instance.eth.Contract(abi, address);
      setWeb3(web3Instance);
      setFactoryAddress(address);
      setContract(contractInstance);
    };

    init();
  }, []);

  const createProduct = ({ name, price, productURI = "", lockTime }) => {
    const newPrice = web3.utils.toWei(price, "ether");
    return contract.methods
      .createProduct(
        name,
        newPrice,
        productURI,
        web3Utils.toBN(lockTime).toString()
      )
      .send({ from: user.attributes.ethAddress });
  };

  return { createProduct, factoryContract: contract, factoryAddress };
};

export default useEscrowFactory;
