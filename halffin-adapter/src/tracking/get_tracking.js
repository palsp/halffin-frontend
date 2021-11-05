const { Requester, Validator } = require("@chainlink/external-adapter");
const { customError } = require("../error");
const customParams = {
  trackingNo: ["trackingNo"],
  slug: ["slug"],
  endpoint: false,
};

module.exports = (input, callback) => {
  const validator = new Validator(input, customParams);
  const trackingNo = validator.validated.data.trackingNo;
  const slug = validator.validated.data.slug;
  const url = `https://api.aftership.com/v4/trackings/${slug}/${trackingNo}`;
  const jobRunID = validator.validated.id;
  const config = {
    url,
    method: "get",
    headers: {
      "aftership-api-key": process.env.API_KEY,
    },
  };

  Requester.request(config, customError)
    .then((response) => {
      callback(
        response.status,
        Requester.success(jobRunID, response.data)
      );
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error));
    });
};
