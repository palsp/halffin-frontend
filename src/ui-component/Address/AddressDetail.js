const AddressDetail = ({ address }) => {
  return (
    <>
      {Object.keys(address).map((attr, index) => {
        return (
          <h4 key={index}>
            {attr}: {address[attr]}
          </h4>
        );
      })}
    </>
  );
};

export default AddressDetail;
