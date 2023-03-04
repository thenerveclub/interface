import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

export const useTAD = (checksumAddress: string, chainId: number) => {
	const [tad, setTAD] = useState<any[]>([]);
	const timestamp = Math.floor(Date.now() / 1000);

	const QueryForDare = `
   {
      tasks(where: { endTask_gt:"${timestamp}", recipientAddress:"${checksumAddress}", positiveVotes_gte: "1", negativeVotes_lte: "0" }, orderBy:amount, orderDirection:desc, first: 100) 
      {
       id
       description
       recipientAddress
       endTask
       proofLink
       amount
		 positiveVotes
       negativeVotes
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

				setTAD(data.data.tasks);
			} catch (error) {
				console.error(error);
			}
		};

		// Refresh every 60 seconds
		const interval = setInterval(getTAD, 60000);

		// Call the function on first page load
		getTAD();

		// Clear the interval on unmount
		return () => clearInterval(interval);

		// Refresh the data when the chainId or checksumAddress changes
	}, [chainId, checksumAddress]);

	return tad;
};

export default useTAD;
