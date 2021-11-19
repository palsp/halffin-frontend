import axios from "axios";

const getImageAsync = async (url, cb) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  cb(response.data);
};

export { getImageAsync };
