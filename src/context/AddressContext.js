import { useContext, createContext, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

const AddressContext = createContext({
  address: {
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: '',
    phoneNumber: '',
  },
  setAddress: () => {
    return;
  },
});

const AddressProvider = ({ children }) => {
  const { Moralis, user } = useMoralis();

  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    countryCode: '',
    phoneNumber: '',
  });

  const getAddress = async () => {
    try {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const Address = Moralis.Object.extend('Address');
      const query = new Moralis.Query(Address);
      query.equalTo('userId', user.id);

      const addresses = await query.find();

      setAddresses(addresses);
    } catch (err) {}
  };

  const addAddress = async (address) => {
    try {
      await Moralis.Cloud.run('addAddress', address);
    } catch (err) {}
  };

  const editAddress = async (address, addressId) => {
    try {
      await Moralis.Cloud.run('editAddress', {
        address,
        addressId,
      });
    } catch (err) {}
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await Moralis.Cloud.run('deleteAddress', {
        addressId,
      });
    } catch (err) {}
  };

  useEffect(() => {
    getAddress();
  }, [user]);

  return (
    <AddressContext.Provider
      value={{
        address,
        addresses,
        setAddresses,
        setAddress,
        getAddress,
        addAddress,
        editAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const useAddress = () => useContext(AddressContext);

export { AddressProvider, useAddress };
