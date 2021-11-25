import { useMoralis } from 'react-moralis';

const useQuery = () => {
  const { Moralis } = useMoralis();

  const queryEqualTo = async ({ className, attr, target }) => {
    const query = new Moralis.Query(`${className}`);

    query.equalTo(attr, target);

    const res = await query.first();
    return res;
  };

  return { queryEqualTo };
};

export default useQuery;
