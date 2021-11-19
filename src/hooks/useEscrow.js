import { abi } from "api/chain-info/contracts/Escrow.json";
import { useMoralis } from "react-moralis";
import Product from "model/Product";
import { useWeb3 } from ".";
const useEscrow = () => {
  const { user, Moralis } = useMoralis();
  const { web3, web3Utils } = useWeb3();

  const getContractInstance = (contractAddress, web3Instance = web3) =>
    new web3Instance.eth.Contract(abi, contractAddress);

  const serializeProduct = (productDetail, productAddress) => {
    const product = new Product({
      ...productDetail,
      price: web3Utils.fromWei(productDetail.price, "ether"),
    });

    product.addAddress(productAddress);
    return product;
  };

  const getProductDetail = async (contractAddress) => {
    const web3Instance = await Moralis.enableWeb3();
    const contractInstance = getContractInstance(contractAddress, web3Instance);
    const result = await contractInstance.methods.product().call();
    return serializeProduct(result, contractAddress);
  };

  const order = (contractAddress, price) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.methods.order().send({
      from: user.attributes.ethAddress,
      value: web3Utils.toWei(price, "ether"),
    });
  };

  const cancelOrder = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.methods
      .cancelOrder()
      .send({ from: user.attributes.ethAddress });
  };

  const updateShipment = (contractAddress, trackingId) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.methods
      .updateShipment(trackingId)
      .send({ from: user.attributes.ethAddress });
  };

  const requestShippingDetail = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.methods
      .requestShippingDetail()
      .send({ from: user.attributes.ethAddress });
  };

  const listenOnShipmentDetail = (contractAddress, cb) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.once("ShipmentUpdated", cb);
  };

  const reclaimFund = (contractAddress) => {
    const contractInstance = getContractInstance(contractAddress);
    return contractInstance.methods
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
    listenOnShipmentDetail,
  };
};

export default useEscrow;
