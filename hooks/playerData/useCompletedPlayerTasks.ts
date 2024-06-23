import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

export const useCompletedPlayerTasks = (checksumAddress: string) => {
	const [completedPlayerTasks, setCompletedPlayerTasks] = useState<{ [chainId: string]: any[] }>({});
	const timestamp = Math.floor(Date.now() / 1000);

	// console.log('completedPlayerTasks', timestamp, checksumAddress);

	useEffect(() => {
		if (!checksumAddress) {
			// Handle the case where the checksumAddress is not ready or not valid
			setCompletedPlayerTasks({});

			return;
		}

		const getCompletedPlayerTasks = async () => {
			const QueryForCompletedTasks = `
   {
      tasks(
			where: { 
				or: [
			{ endTask_lt: "${timestamp}", recipientAddress:"${checksumAddress}", positiveVotes_gte: "0", negativeVotes_lte: "0" },
			{ finished: true, recipientAddress:"${checksumAddress}", positiveVotes_gte: "0", negativeVotes_lte: "0" }
		 ],
		},
		orderBy: amount,
		orderDirection: desc,
		first: 100
	 ) {
		 id
		 initiatorAddress
		 endTask
		 entranceAmount
		 negativeVotes
		 positiveVotes
		 participants
		 proofLink
		 description
		 amount
		 chainId
		 latitude
		 longitude
      }
    }
  `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForCompletedTasks }),
					})
						.then((response) => response.json())
						.then((data) => {
							if (!data.data) {
								throw new Error(`No data found for chainId ${chainId}`);
							}
							const filteredTasks = data.data.tasks.filter((task) => task.chainId === chainId);
							return { [chainId]: filteredTasks };
						});
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});
				setCompletedPlayerTasks(combinedData);
			} catch (error) {
				console.error(error);
				console.log('error', error);
			}
		};

		getCompletedPlayerTasks();
	}, [checksumAddress]);

	return completedPlayerTasks;
};

export default useCompletedPlayerTasks;
