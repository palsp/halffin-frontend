Moralis.Cloud.define(
  "getUserDetail",
  async (request) => {
    const UserDetails = Moralis.Object.extend("UserDetails");
    const query = new Moralis.Query(UserDetails);
    query.equalTo("userId", request.params.userId);
    return query.find({ useMasterKey: true });
  },
  {
    fields: getUserDetailFields,
  }
);
