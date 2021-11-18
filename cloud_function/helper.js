/* eslint-disable no-unused-vars */

const validationRules = (request) => {
  if (request.master) {
    return;
  }
  if (!request.user) {
    throw new Error('Unauthorized, Please Login First!');
  }
};

const getUserDetailFields = {
  userId: {
    required: true,
    type: String,
  },
};

const Address = {
  firstName: {
    required: true,
    type: String,
    error: 'FirstName is required',
  },
  lastName: {
    required: true,
    type: String,
  },
  address1: {
    required: true,
    type: String,
  },
  address2: {
    required: false,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  city: {
    required: true,
    type: String,
  },
  state: {
    required: true,
    type: String,
  },
  postalCode: {
    required: true,
    type: String,
  },
  countryCode: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: String,
  },
};
