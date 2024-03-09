import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useDareData = (network: string, id: string) => {
	const [dareData, setDareData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		if (!id) {
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
               userStake
               blockNumber
               endTask
               finished
               vote
               voted
              task {
               id
               initiatorAddress
               recipientAddress
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
				const fetchDareData = await fetch(CHAINS[network]?.graphApi, {
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
	}, [network, id]);

	return { dareData, isLoading };
};

export default useDareData;
