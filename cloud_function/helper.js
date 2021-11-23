/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const validationRules = (request) => {
  if (request.master) {
    return;
  }
  if (!request.user) {
    throw new Error('Unauthorized, Please Login First!');
  }
};

const ShipmentDetail = {
  trackingId: {
    required: true,
    type: String,
  },
  trackingNo: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
  },
  contractAddress: {
    required: true,
    type: String,
  },
  buyerId: {
    required: true,
    type: String,
  },
};

const Address = {
  firstName: {
    required: true,
    type: String,
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
 * @param {string} className class from Moralis
 * @param {string} attr field in class to check
 * @param {string} target target checked with attr
 * @param {string} allowId the id that would be allow to read
 * @param {boolean} state true = allow | false = not allow
 * @returns void
 */
const setReadACL = async ({ className, attr, target, allowId, state }) => {
  const Class = Moralis.Object.extend(`${className}`);
  const query = new Moralis.Query(Class);
  query.equalTo(attr, target);
  const result = await query.first({ useMasterKey: true });

  const acl = result.getACL();
  acl.setReadAccess(allowId, state);
  result.setACL(acl);
  await result.save(null, { useMasterKey: true });
};
