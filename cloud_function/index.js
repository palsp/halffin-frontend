/* eslint-disable no-undef */

Moralis.Cloud.define(
  'getUserByEthAddress',
  async (request) => {
    const query = new Moralis.Query('_User');
    query.equalTo('ethAddress', request.params.targetEthAddr.toLowerCase());
    return query.first({ useMasterKey: true });
  },
  {
    fields: {
      targetEthAddr: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'getUserDetail',
  async (request) => {
    const UserDetails = Moralis.Object.extend('UserDetails');
    const query = new Moralis.Query(UserDetails);
    query.equalTo('userId', request.params.userId);
    return query.find({ useMasterKey: true });
  },
  {
    fields: getUserDetailFields,
  }
);

Moralis.Cloud.define(
  'addAddress',
  async (request) => {
    const Address = Moralis.Object.extend('Address');

    const query = new Moralis.Query(Address);
    query.equalTo('userId', request.user.id);
    const address = await query.first({ useMasterKey: true });

    // ADD
    if (!address) {
      const address = new Address();
      const addressACL = new Moralis.ACL(request.user);
      address.setACL(addressACL);

      await address.save({ ...request.params, userId: request.user.id }, { useMasterKey: true });
      return { success: true };

      // EDIT
    } else {
      await address.save({ ...request.params }, { useMasterKey: true });

      return { success: true };
    }
  },
  {
    fields: {
      address: Address,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'allowPermissionToUserId',
  async (request) => {
    try {
      await setReadACL({
        userId: request.user.id,
        targetId: request.params.targetId,
        state: true,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      targetId: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'removePermissionToUserId',
  async (request) => {
    try {
      await setReadACL({
        userId: request.user.id,
        targetId: request.params.targetId,
        state: true,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      targetId: UserId,
    },
  },
  validationRules
);
