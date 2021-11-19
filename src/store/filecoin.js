import { NFTStorage } from "nft.storage";

class FileStorage {
  constructor(token = process.env.REACT_APP_NFTSTORAGE_TOKEN) {
    this.client = new NFTStorage({ token });
  }

  async uploadToFileCoin(filename, image, description) {
    try {
      const metadata = await this.client.store({
        name: filename,
        description: description,
        image: image,
      });
      console.log("IPFS URL for the metadata: ", metadata.url);
      console.log("metadata.json contents: ", metadata.data);
      console.log(
        "metadata.json contents with IPFS gateway URLs: ",
        metadata.embed()
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default new FileStorage();
