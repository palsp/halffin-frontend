class Product {
  #name;
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
    this.stage = stage;
    this.trackingId = trackingId;
    this.deliveryStatus = deliveryStatus;
  }

  addAddress(addr) {
    this.address = addr;
  }
  get name() {
    return `${this.#name} #${this.id}`;
  }
}

export default Product;
