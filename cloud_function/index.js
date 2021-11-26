/* eslint-disable no-undef */

Moralis.Cloud.define(
  'getUserByEthAddress',
  async (request) => {
    try {
      const query = new Moralis.Query('_User');
      query.equalTo('ethAddress', request.params.targetEthAddr.toLowerCase());
      return query.first({ useMasterKey: true });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      targetEthAddr: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'addAddress',
  async (request) => {
    try {
      const Address = Moralis.Object.extend('Address');

      const address = new Address();
      const addressACL = new Moralis.ACL(request.user);
      address.setACL(addressACL);

      await address.save(
        { ...request.params, userId: request.user.id },
        { useMasterKey: true }
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
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
  'editAddress',
  async (request) => {
    try {
      const { addressId, address: newAddress } = request.params;
      const {
        firstName,
        lastName,
        email,
        address1,
        address2,
        city,
        state,
        postalCode,
        countryCode,
        phoneNumber,
      } = newAddress;
      const Address = Moralis.Object.extend('Address');

      const query = new Moralis.Query(Address);
      query.equalTo('objectId', addressId);

      const address = await query.first({ useMasterKey: true });
      if (!address) {
        return { success: false, message: 'No address found' };
      }

      await address.save(
        {
          firstName,
          lastName,
          email,
          address1,
          address2,
          city,
          state,
          postalCode,
          countryCode,
          phoneNumber,
        },
        { useMasterKey: true }
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      address: Address,
      addressId: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'deleteAddress',
  async (request) => {
    try {
      const Address = Moralis.Object.extend('Address');

      const query = new Moralis.Query(Address);
      query.equalTo('objectId', request.params.addressId);

      const address = await query.first({ useMasterKey: true });
      await address.destroy({ useMasterKey: true });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      addressId: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'generateTransaction',
  async (request) => {
    try {
      const { contractAddress, address } = request.params;
      const {
        firstName,
        lastName,
        email,
        address1,
        address2,
        city,
        state,
        postalCode,
        countryCode,
        phoneNumber,
      } = address;

      const web3 = Moralis.web3ByChain('0x2a');
      const contract = new web3.eth.Contract(abi, contractAddress);
      const product = await contract.methods.product().call();

      if (
        !request.user.attributes.accounts.includes(product.buyer.toLowerCase())
      ) {
        return {
          success: false,
          message: 'Unauthorized!',
          product,
          user: request.user,
        };
      }

      const Transaction = Moralis.Object.extend('Transaction');

      const transaciton = new Transaction();
      const transactionACL = new Moralis.ACL(request.user);
      transaciton.setACL(transactionACL);

      const tx = await transaciton.save(
        {
          contractAddress,
          address: {
            firstName,
            lastName,
            email,
            address1,
            address2,
            city,
            state,
            postalCode,
            countryCode,
            phoneNumber,
          },
        },
        { useMasterKey: true }
      );

      return tx;
    } catch (err) {
      return { success: false, x: request.user, error: err.message };
    }
  },
  {
    fields: {
      contractAddress: String,
      // addressId: String,
      address: Address,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'allowPermissionToUserId',
  async (request) => {
    try {
      // await setReadACL({
      //   className: 'Address',
      //   attr: 'objectId',
      //   target: request.params.addressId,
      //   allowId: request.params.targetUserId,
      //   state: true,
      // });

      await setReadACL({
        className: 'Transaction',
        attr: 'objectId',
        target: request.params.transactionId,
        allowId: request.params.targetUserId,
        state: true,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: {
      targetUserId: String,
      addressId: String,
      transactionId: String,
    },
  },
  validationRules
);

Moralis.Cloud.define(
  'removePermissionToUserId',
  async (request) => {
    try {
      await setReadACL({
        className: 'Address',
        attr: 'userId',
        target: request.user.id,
        allowId: request.params.targetId,
        state: false,
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
  'addShipmentDetail',
  async (request) => {
    try {
      const Shipment = Moralis.Object.extend('Shipment');

      const shipment = new Shipment();
      const shipmentACL = new Moralis.ACL(request.user);
      shipment.setACL(shipmentACL);

      await shipment.save(
        { ...request.params, userId: request.user.id },
        { useMasterKey: true }
      );
      await setReadACL({
        className: 'Shipment',
        attr: 'trackingId',
        target: request.params.trackingId,
        allowId: request.params.buyerId,
        state: true,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  {
    fields: ShipmentDetail,
  },
  validationRules
);
