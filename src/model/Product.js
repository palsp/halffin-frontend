import mapStage from "api/stage";

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
  }) {
    this.id = id;
    this.#name = name;
    this.owner = owner;
    this.buyer = buyer;
    this.price = price;
    this.#stage = stage;
    this.trackingId = trackingId;
    this.deliveryStatus = deliveryStatus;
  }

  addAddress(addr) {
    this.address = addr;
  }
  get name() {
    return `${this.#name} #${this.id}`;
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

  checkStage(stage) {
    return stage == this.#stage;
  }
}

export default Product;
