import { useEffect, useState } from "react";
import { getImageAsync } from "utils";
import { Skeleton, Avatar } from "@mui/material";

const BaseImage = ({
  product,
  isLoading,
  onStartLoading,
  onFinishLoading,
  sx = {},
}) => {
  const [base64, setBase64] = useState();
  useEffect(() => {
    const init = async () => {
      if (product.base64Image) {
        setBase64(product.base64Image);
        onFinishLoading();
        return;
      }
      const imageURI = await product.fetchImage();
      onStartLoading();
      await getImageAsync(imageURI, (data) => {
        const buffer = Buffer.from(data, "binary").toString("base64");
        product.setBase64Image(buffer);
        setBase64(buffer);
        onFinishLoading();
      });
    };

    init();
  }, [product, product.imageURI]);

  return (
    <>
      {" "}
      {isLoading || !base64 ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          style={{ ...sx }}
        />
      ) : (
        <Avatar
          variant="square"
          src={`data:image/jpeg;charset=utf-8;base64,${base64}`}
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "10px",
            ...sx,
          }}
        />
      )}
    </>
  );
};

export default BaseImage;
