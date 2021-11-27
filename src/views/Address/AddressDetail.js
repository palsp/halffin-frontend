import Detail from './Detail/Detail';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

const AddressDetail = ({ address, color = 'white' }) => {
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

  return (
    <>
      {firstName.length > 0 ? (
        <div style={{ justifyContent: 'left', marginTop: '12px' }}>
          <Detail
            title={'Name:'}
            description={`${firstName} ${lastName}`}
            color={color}
          />
          <Detail title={'Email:'} description={`${email}`} color={color} />
          <Detail
            title={'Address: '}
            color={color}
            description={`${address1} ${address2}
      ${city} ${state}
      ${postalCode}`}
          />
          <Detail
            title={'Phone:'}
            color={color}
            description={`${formatPhoneNumberIntl(
              phoneNumber
            )} ${countryCode} `}
          />
        </div>
      ) : null}
    </>
  );
};

export default AddressDetail;
