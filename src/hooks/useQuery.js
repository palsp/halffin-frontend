import { useMoralis } from 'react-moralis';

const useQuery = () => {
  const { Moralis } = useMoralis();

  const queryEqualTo = async ({ className, attr, target, latest = false }) => {
    const query = new Moralis.Query(`${className}`);

    query.equalTo(attr, target);

    if (latest) {
      const res = await query.find();
      return res.slice(-1).pop();
    }

    const res = await query.first();
    return res;
  };

  return { queryEqualTo };
};

export default useQuery;
