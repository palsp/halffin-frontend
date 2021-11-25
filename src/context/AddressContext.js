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
      // const addr = {
      //   firstName: res.attributes.firstName,
      //   lastName: res.attributes.lastName,
      //   email: res.attributes.email,
      //   address1: res.attributes.address1,
      //   address2: res.attributes.address2,
      //   city: res.attributes.city,
      //   state: res.attributes.state,
      //   postalCode: res.attributes.postalCode,
      //   countryCode: res.attributes.countryCode,
      //   phoneNumber: res.attributes.phoneNumber,
      // };
      // setAddress(addr);
      setAddresses(addresses);
    } catch (err) {
      console.log('Error cont', err.message);
    }
  };

  const addAddress = async (address) => {
    try {
      await Moralis.Cloud.run('addAddress', address);
    } catch (err) {
      console.log('Error', err.message);
    }
  };

  const editAddress = async (address, addressId) => {
    console.log('here1');
    try {
      const res = await Moralis.Cloud.run('editAddress', {
        address,
        addressId,
      });
      console.log('here2');

      console.log('edit', res);
    } catch (err) {
      console.log('Error', err.message);
    }
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
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const useAddress = () => useContext(AddressContext);

export { AddressProvider, useAddress };
