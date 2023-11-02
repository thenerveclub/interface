import { useEffect, useState } from 'react';

export const useTAD = (dareID: string, graphApi: string, chainId: string) => {
	const [tad, setTAD] = useState<any[]>([]);

	const QueryForDare = `
    {
      tasks(where: { id:"${dareID}"}) 
      {
        description
        recipientAddress
        recipientName
        endTask
        proofLink
        positiveVotes
        negativeVotes
        amount
        entranceAmount
        participants
      }
    }
  `;

	useEffect(() => {
		const getTAD = async () => {
			try {
				const response = await fetch(graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDare }),
				});

				if (response.ok) {
					const data = await response.json();
					setTAD(data.data.tasks);
				}
			} catch (error) {
				console.error(error);
			}
		};

		getTAD();

		const interval = setInterval(getTAD, 60000);
		return () => clearInterval(interval);
	}, [dareID, graphApi]);

	return { tad };
};
