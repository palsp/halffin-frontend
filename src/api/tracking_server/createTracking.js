import axios from "./axios";

export const createTracking = async (id, trackingNo) => {
  const response = await axios.post("/create_tracking", {
    id,
    data: { trackingNo },
  });
  return response.data;
};
