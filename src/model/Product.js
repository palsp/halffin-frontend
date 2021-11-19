import mapStage from "api/stage";
import axios from "axios";
import fileStorage from "store/filecoin";
import { blocksToDays } from "utils";

class Product {
  #name;
  #stage;
  constructor({
    id,
    name,
    owner,
    buyer,
    price,
    stage,
    trackingId,
    deliveryStatus,
    productURI,
  }) {
    this.id = id;
    this.#name = name;
    this.owner = owner;
    this.buyer = buyer;
    this.price = price;
    this.#stage = stage;
    this.trackingId = trackingId;
    this.deliveryStatus = deliveryStatus;
    this.productUri = productURI;
  }

  addAddress(addr) {
    this.address = addr;
  }
  get name() {
    return `${this.#name} #${this.id}`;
  }

  get nameForDisplay() {
    let display = this.#name;
    if (this.#name.length > 7) {
      display = this.#name.substr(0, 7) + "...";
    }
    return `${display} #${this.id}`;
  }

  get isAbleToBuy() {
    return this.checkStage(0);
  }

  get isWaitForShipping() {
    return this.checkStage(1);
  }

  get isAbleToCheckTrackingStatus() {
    return this.checkStage(2);
  }

  get isAbleToClaimFund() {
    return this.checkStage(3);
  }

  get isEnd() {
    return this.checkStage(4);
  }

  get stage() {
    return mapStage[this.#stage];
  }

  get _stage() {
    return this.#stage;
  }

  setBase64Image(base64) {
    this.base64Image = base64;
  }

  async fetchImage() {
    try {
      const metadata = fileStorage.convertMetaDataUrlToGateWayUrl(
        this.productUri
      );

      const {
        data: { image, description },
      } = await axios.get(metadata);
      this.imageURI = fileStorage.convertMetaDataUrlToGateWayUrl(image);
      this.description = description;
    } catch (err) {
      this.description = "";
      this.imageURI = "https://picsum.photos/200";
    }
    return this.imageURI;
  }

  checkStage(stage) {
    return stage == this.#stage;
  }
}

export default Product;
