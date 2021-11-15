import useWeb3 from "hooks/useWeb3";
import { abi } from "api/chain-info/contracts/Escrow.json";
import { useMoralis } from "react-moralis";
import mapStageToString from "api/stage";
import Product from "model/Product";
const useEscrow = () => {
  const { web3 } = useWeb3();
  const { user } = useMoralis();

  const getContractInstance = (contractAddress) =>
    new web3.eth.Contract(abi, contractAddress);
  const serializeProduct = (productDetail) =>
    new Product({
      id: productDetail.id,
      name: productDetail.name,
      owner: productDetail.owner,
      buyer: productDetail.buyer,
      price: web3.utils.fromWei(productDetail.price, "ether"),
      stage: mapStageToString[productDetail.stage],
      trackingId: productDetail.trackingId,
      deliveryStatus: productDetail.deliveryStatus,
    });

  const getProductDetail = async (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    const result = await contractInstance.methods.product().call();
    return serializeProduct(result);
  };

  const order = (contractAddress, price) => {
    const contractInstance = getContractInstance(contractAddress);
    contractInstance.methods.order().send({
      from: user.attributes.ethAddress,
      value: web3.utils.toWei(price, "ether"),
    });
  };

  const cancelOrder = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    contractInstance.methods
      .cancelOrder()
      .send({ from: user.attributes.ethAddress });
  };

  const updateShipment = (contractAddress, trackingId) => {
    const contractInstance = getContractInstance(contractAddress);
    contractInstance.methods
      .updateShipment(trackingId)
      .send({ from: user.attributes.ethAddress });
  };

  const requestShippingDetail = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    contractInstance.methods
      .requestShippingDetail()
      .send({ from: user.attributes.ethAddress });
  };

  const reclaimFund = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    contractInstance.methods
      .reclaimFund()
      .send({ from: user.attributes.ethAddress });
  };

  return {
    getContractInstance,
    getProductDetail,
    order,
    cancelOrder,
    updateShipment,
    requestShippingDetail,
    reclaimFund,
  };
};

export default useEscrow;
