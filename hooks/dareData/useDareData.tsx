import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useDareData = (chainIdUrl: number, id: string) => {
	const [dareData, setDareData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		if (!chainIdUrl) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setDareData([]);
			setIsLoading(false);
			return;
		}

		const getDareData = async () => {
			const QueryForDareData = `
          {
            userTasks(where: {task_: {id: "${id}"}}) {
               id
               userAddress
               userName
               userStake
               blockNumber
               endTask
               finished
               vote
               voted
              task {
               id
               initiatorAddress
               initiatorName
               recipientAddress
               recipientName
               accepted
               amount
               chainId
               description
               endTask
               entranceAmount
               executed
               finished
               negativeVotes
               participants
               positiveVotes
               proofLink
              }
            }
          }
      `;

			try {
				const fetchDareData = await fetch(CHAINS[chainIdUrl]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDareData }),
				});

				const data = await fetchDareData.json();
				setDareData(data.data.userTasks);
			} catch (error) {
				console.error(error);
				setDareData([]);
			} finally {
				setIsLoading(false);
			}
		};

		getDareData();
	}, [chainIdUrl, id]);

	return { dareData, isLoading };
};

export default useDareData;
