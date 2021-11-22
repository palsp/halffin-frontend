import { useState, useEffect } from 'react';

import { useMoralis } from 'react-moralis';

const useQuery = () => {
  const { Moralis } = useMoralis();

  const queryEqualTo = async ({ className, attr, target }) => {
    const query = new Moralis.Query(`${className}`);

    query.equalTo(attr, target);

    const res = await query.first();
    if (!res || res.length === 0) {
      throw new Error('Query Failed');
    }

    return res;
  };

  return { queryEqualTo };
};

export default useQuery;
