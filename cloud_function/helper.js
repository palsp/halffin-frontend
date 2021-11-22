/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const validationRules = (request) => {
  if (request.master) {
    return;
  }
  if (!request.user) {
    throw new Error("Unauthorized, Please Login First!");
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
    error: "FirstName is required",
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

/**
 * Set Read Access ACL to targetId for the userId
 * @param {string} userId the one who will allow targetId
 * @param {string} targetId targetId to set acl permission
 * @param {boolean} state true = allow | false = not allow
 * @returns void
 */
const setReadACL = async ({ userId, targetId, state }) => {
  const Address = Moralis.Object.extend("Address");
  const query = new Moralis.Query(Address);
  query.equalTo("userId", userId);
  const result = await query.first({ useMasterKey: true });

  const acl = result.getACL();
  acl.setReadAccess(targetId, state);
  result.setACL(acl);
  await result.save(null, { useMasterKey: true });
};
