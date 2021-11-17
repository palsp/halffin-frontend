import { useState, useEffect } from "react";

import { useMoralis } from "react-moralis";
import { abi } from "api/chain-info/contracts/EscrowFactory.json";
import networkMapping from "api/chain-info/deployments/map.json";
import { constants } from "ethers";
import useWeb3 from "hooks/useWeb3";

const useEscrowFactory = () => {
  const { web3, chainId } = useWeb3();
  const { user } = useMoralis();
  const [contract, setContract] = useState();
  const [factoryAddress, setFactoryAddress] = useState();

  useEffect(() => {
    if (!web3 || !chainId) return;

    const address = chainId
      ? networkMapping[chainId.toString()].EscrowFactory[0]
      : constants.AddressZero;
    const contractInstance = new web3.eth.Contract(abi, address);
    setFactoryAddress(address);
    setContract(contractInstance);
  }, [web3, chainId]);

  const createProduct = ({ name, price, lockTime }) => {
    const newPrice = web3.utils.toWei(price, "ether");
    return contract.methods
      .createProduct(name, newPrice, lockTime)
      .send({ from: user.attributes.ethAddress });
  };

  return { createProduct, factoryContract: contract, factoryAddress };
};

export default useEscrowFactory;
