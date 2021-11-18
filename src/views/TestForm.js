import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMoralis } from 'react-moralis';

const TestForm = () => {
  const { Moralis } = useMoralis();

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

  const addAddress = async (address) => {
    try {
      const res = await Moralis.Cloud.run('addAddress', address);

      console.log('add address', res);
    } catch (err) {
      console.log('Error', err.message);
    }
  };

  const getAddress = async () => {
    try {
      const currentUser = await Moralis.User.currentAsync();

      const query = new Moralis.Query('Address');
      query.equalTo('userId', currentUser.id);
      const res = await query.first();
      console.log(res.attributes);
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
      console.log('add', Object.keys(address));
    } catch (err) {
      console.log('Error', err.message);
    }
  };

  return (
    <div>
      <Formik
        initialValues={address}
        validationSchema={Yup.object({
          firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
          lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          address1: Yup.string().required('Required'),
          address2: Yup.string(),
          city: Yup.string().required('Required'),
          state: Yup.string().required('Required'),
          postalCode: Yup.string().required('Required'),
          countryCode: Yup.string().required('Required'),
          phoneNumber: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log('values', values);

          addAddress(values).then(() => {
            setSubmitting(false);
            console.log('x1');
          });
          console.log('x2');
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" type="text" />
          <ErrorMessage name="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" type="text" />
          <ErrorMessage name="lastName" />

          <label htmlFor="email">Email Address</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" />

          <label htmlFor="address1">address1 Address</label>
          <Field name="address1" type="text" />
          <ErrorMessage name="address1" />

          <label htmlFor="address2">address2 Address</label>
          <Field name="address2" type="text" />
          <ErrorMessage name="address2" />
          <label htmlFor="city">city Address</label>
          <Field name="city" type="text" />
          <ErrorMessage name="city" />

          <label htmlFor="state">state Address</label>
          <Field name="state" type="state" />
          <ErrorMessage name="state" />

          <label htmlFor="postalCode">postal code</label>
          <Field name="postalCode" type="text" />
          <ErrorMessage name="postalCode" />

          <label htmlFor="countryCode">countryCode Address</label>
          <Field name="countryCode" type="text" />
          <ErrorMessage name="countryCode" />

          <label htmlFor="phoneNumber">phoneNumber Address</label>
          <Field name="phoneNumber" type="text" />
          <ErrorMessage name="phoneNumber" />

          <button type="submit">Submit</button>
        </Form>
      </Formik>

      <button onClick={getAddress}>getAddress</button>
      {Object.keys(address).map((attr, index) => {
        return (
          <h4 key={index}>
            {attr}: {address[attr]}
          </h4>
        );
      })}
    </div>
  );
};

export default TestForm;
