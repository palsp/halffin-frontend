const { Requester, Validator } = require("@chainlink/external-adapter");
const { customError } = require("../error");
const customParams = {
  trackingNo: ["trackingNo"],
  endpoint: false,
};

module.exports = (input, callback) => {
  const validator = new Validator(input, customParams);
  const url = "https://api.aftership.com/v4/trackings";
  const jobRunID = validator.validated.id;
  const trackingNo = validator.validated.data.trackingNo;
  const config = {
    url,
    method: "post",
    headers: {
      "aftership-api-key": process.env.API_KEY,
    },
    data: {
      tracking: {
        tracking_number: trackingNo,
      },
    },
  };

  Requester.request(config, customError)
    .then((response) => {
      callback(
        response.status,
        Requester.success(jobRunID, response.data.data.tracking)
      );
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error));
    });
};
