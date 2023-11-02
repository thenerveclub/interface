import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

export const useTAD = (checksumAddress: string, chainId: number) => {
	const [tad, setTAD] = useState<any[]>([]);
	const timestamp = Math.floor(Date.now() / 1000);

	const QueryForDare = `
   {
      tasks(where: { endTask_lt:"${timestamp}", recipientAddress:"${checksumAddress}", positiveVotes_gte: "0", negativeVotes_lte: "0" }, orderBy:amount, orderDirection:desc, first: 100) 
      {
		 id
		 initiatorAddress
		 initiatorName
		 endTask
		 entranceAmount
		 negativeVotes
		 positiveVotes
		 participants
		 proofLink
		 description
		 amount
      }
    }
  `;

	useEffect(() => {
		const getTAD = async () => {
			try {
				const response = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDare }),
				});

				const data = await response.json();

				if (data && data.data && data.data.tasks) {
					setTAD(data.data.tasks);
				}
			} catch (error) {
				console.error(error);
			}
		};

		getTAD();
	}, [chainId, checksumAddress]);

	return tad;
};

export default useTAD;
