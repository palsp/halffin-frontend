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

      const res = await query.first();

      const addr = {
        firstName: res.attributes.firstName,
        lastName: res.attributes.lastName,
        email: res.attributes.email,
        address1: res.attributes.address1,
        address2: res.attributes.address2,
        city: res.attributes.city,
        state: res.attributes.state,
        postalCode: res.attributes.postalCode,
        countryCode: res.attributes.countryCode,
        phoneNumber: res.attributes.phoneNumber,
      };
      setAddress(addr);
    } catch (err) {
      console.log('Error cont', err.message);
    }
  };

  const addAddress = async (address) => {
    try {
      const res = await Moralis.Cloud.run('addAddress', address);
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
        setAddress,
        addAddress,
        getAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const useAddress = () => useContext(AddressContext);

export { AddressProvider, useAddress };
